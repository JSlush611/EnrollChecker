package scraper

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"net"
	"net/http"
	"net/http/cookiejar"
	"os"
	"time"

	"github.com/JSlush611/EnrollChecker/scraper/cache"
)

type customTransport struct {
	http.Transport
}

type Scraper struct {
	Client  *http.Client
	baseURL string
	reqURL  string
	Data    *cache.CacheItem

	Cache *cache.Cache
}

type PostedData struct {
	TermCode    string `json:"TermCode"`
	SubjectCode string `json:"SubjectCode"`
	CourseID    string `json:"CourseID"`
}

func New(cache *cache.Cache) *Scraper {
	result := &Scraper{
		Cache: cache,
	}

	result.initiateScraper()

	return result
}

func (t *customTransport) Dialer(network, addr string) (net.Conn, error) {
	conn, err := net.DialTimeout(network, addr, time.Second*15)
	if err != nil {
		fmt.Println("custom dialer error:", err)
		return nil, err
	}
	return conn, nil
}

func (t *customTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	//fmt.Println("Custom RoundTrip: ", req.URL)
	return t.Transport.RoundTrip(req)
}

func (s *Scraper) initiateScraper() {
	transport := &customTransport{}
	transport.Dial = transport.Dialer
	jar, err := cookiejar.New(nil)
	if err != nil {
		panic(err)
	}
	transport.TLSClientConfig = &tls.Config{
		InsecureSkipVerify: true,
	}

	s.Client = &http.Client{
		Jar:       jar,
		Transport: transport,
	}
	s.baseURL = "https://public.enroll.wisc.edu/api/search/v1/enrollmentPackages/"
}

func (s *Scraper) BuildRequestURL(numbers PostedData) string {
	result := (s.baseURL + numbers.TermCode + "/" + numbers.SubjectCode + "/" + numbers.CourseID)
	s.reqURL = result

	return result
}

func (s *Scraper) SetRequestURL(termCode, subjectCode, courseID string) string {
	result := (s.baseURL + termCode + "/" + subjectCode + "/" + courseID)
	s.reqURL = result

	return result
}

func (s *Scraper) PerformRequest(urlstr string, termCode, subjectCode, courseID string) cache.CacheItem {
	cacheKey := termCode + ":" + subjectCode + ":" + courseID + ":" + urlstr

	// return cached data if available
	if s.Cache.Has(cacheKey) {
		item, err := s.Cache.Get(cacheKey)

		if err == nil {
			s.Data = item
			return *item
		}
	}

	// Use built URL to send Get request and store JSON response
	// To scraper to process after.
	req, err := http.NewRequest("GET", urlstr, nil)
	if err != nil {
		fmt.Print("Error building request")
		panic(err)
	}
	req.Header.Set("Host", "public.enroll.wisc.edu")
	req.Header.Set("Sec-Ch-Ua", `"Google Chrome";v="113", "Chromium";v="113", "Not-A.Brand";v="24"`)
	req.Header.Set("Accept", "application/json, text/plain, */*")
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Sec-Ch-Ua-Mobile", "?0")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36")
	req.Header.Set("Sec-Ch-Ua-Platform", `"macOS"`)
	req.Header.Set("Sec-Fetch-Site", "same-origin")
	req.Header.Set("Sec-Fetch-Mode", "cors")
	req.Header.Set("Sec-Fetch-Dest", "empty")
	req.Header.Set("Referer", "https://public.enroll.wisc.edu/search?term=1242&subject=266")
	req.Header.Set("Accept-Language", "en-US,en;q=0.9")
	req.Header.Set("Connection", "close")

	resp, err := s.Client.Do(req)

	if err != nil {
		fmt.Print("Error sending request")
		panic(err)
	}

	defer resp.Body.Close()

	jsonData, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Print("Error reading res body")
		panic(err)
	}
	os.WriteFile("test.json", jsonData, 0644)

	// cache the response
	item := cache.CacheItem{Value: string(jsonData), Code: resp.StatusCode, UpdatedAt: time.Now().Unix(), CourseId: courseID}
	s.Cache.Set(cacheKey, item, time.Minute*2)

	return item
}

func (s *Scraper) ParseJSONBody(courseId string, item cache.CacheItem) (string, int) {
	// Declare slice that holds maps with string keys and interface{} values
	// Generic representation of JSON objects where keys can be any string
	var classes []map[string]interface{}

	//Unmarshal JSON data from jsonData byte slice into classes
	json.Unmarshal([]byte(item.Value), &classes)

	// Hard to read, basically the code reads the JSON file,
	// parses it into a slice of maps, and then iterates over each map to extract the
	// "availableSeats" value under "packageEnrollmentStatus". It uses type assertions
	// to ensure that the extracted values are of the expected types
	// (map[string]interface{} and float64 in this case).

	sum := 0
	for _, class := range classes {
		if packageEnrollmentStatus, ok := class["packageEnrollmentStatus"].(map[string]interface{}); ok {
			if availableSeats, ok := packageEnrollmentStatus["availableSeats"].(float64); ok {
				sum += int(availableSeats)
			} else {
				fmt.Println("Error: availableSeats is not a float64")
			}
		} else {
			fmt.Println("Error: packageEnrollmentStatus is not a map[string]interface{}")
		}
	}

	return courseId, sum
}
