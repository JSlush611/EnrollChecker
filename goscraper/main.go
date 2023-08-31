package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"net/http/cookiejar"
	"os"
	"time"

	"github.com/JSlush611/EnrollChecker/scraper/cache"
	"github.com/JSlush611/EnrollChecker/scraper/config"
	"github.com/joho/godotenv"
)

var appCache *cache.Cache
var appConfig *config.Config

type AvailabilityResponse struct {
	AvailableSeats int    `json:"availableSeats"`
	CourseId       string `json:"courseId"`
	LastUpdated    int64  `json:"lastUpdated"`
}

type customTransport struct {
	http.Transport
}

type Scraper struct {
	Client  *http.Client
	baseURL string
	reqURL  string
	Data    *cache.CacheItem
}

type PostedData struct {
	TermCode    string `json:"TermCode"`
	SubjectCode string `json:"SubjectCode"`
	CourseID    string `json:"CourseID"`
}

// {"TermCode":"1242","SubjectCode":"266","CourseID":"025498"}

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

func (s *Scraper) InitiateScraper() {

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

func (s *Scraper) BuildRequestURL(numbers PostedData) {
	s.reqURL = (s.baseURL + numbers.TermCode + "/" + numbers.SubjectCode + "/" + numbers.CourseID)
}

func (s *Scraper) PerformRequest() {
	// return cached data if available
	if appCache.Has(s.reqURL) {
		item, err := appCache.Get(s.reqURL)

		if err == nil {
			s.Data = item
			return
		}
	}

	// Use built URL to send Get request and store JSON response
	// To scraper to process after.
	req, err := http.NewRequest("GET", s.reqURL, nil)
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
	item := cache.CacheItem{Value: jsonData, Code: resp.StatusCode, UpdatedAt: time.Now().Unix()}
	appCache.Set(s.reqURL, &item, time.Minute*2)

	s.Data = &item
}

func (s *Scraper) ParseJSONBody() (avaiavailableSeats int) {
	// Declare slice that holds maps with string keys and interface{} values
	// Generic representation of JSON objects where keys can be any string
	var classes []map[string]interface{}

	//Unmarshal JSON data from jsonData byte slice into classes
	json.Unmarshal([]byte(s.Data.Value), &classes)

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
	return sum
}

func checkAvailability(w http.ResponseWriter, r *http.Request) {
	// Check the HTTP method
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON data from the request body into the Numbers struct
	var ClassIDs PostedData
	err := json.NewDecoder(r.Body).Decode(&ClassIDs)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Error parsing request body")
		panic(err)
	}

	scraper := Scraper{}
	scraper.InitiateScraper()
	scraper.BuildRequestURL(ClassIDs)
	scraper.PerformRequest()
	availableSeats := scraper.ParseJSONBody()

	resp := AvailabilityResponse{
		AvailableSeats: availableSeats,
		CourseId:       ClassIDs.CourseID,
		LastUpdated:    scraper.Data.UpdatedAt,
	}

	json.NewEncoder(w).Encode(resp)
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		fmt.Printf("Error loading .env file: %v", err)
	}

	appConfig = config.New()
	appCache = cache.New(appConfig)

	fmt.Printf("Config loaded: %v\n", appConfig)

	appCache.Connect()
	defer appCache.Client.Close()

	http.HandleFunc("/", checkAvailability)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
