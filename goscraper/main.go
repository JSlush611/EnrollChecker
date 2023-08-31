package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"github.com/JSlush611/EnrollChecker/scraper/cache"
	"github.com/JSlush611/EnrollChecker/scraper/config"
	"github.com/JSlush611/EnrollChecker/scraper/scraper"
	"github.com/joho/godotenv"
)

var appCache *cache.Cache
var appConfig *config.Config
var appScraper *scraper.Scraper

type AvailabilityResponse struct {
	AvailableSeats int    `json:"availableSeats"`
	CourseId       string `json:"courseId"`
	LastUpdated    int64  `json:"lastUpdated"`
}

type AvailabilityResponses []AvailabilityResponse

// {"TermCode":"1242","SubjectCode":"266","CourseID":"025498"}

func checkAvailability(w http.ResponseWriter, r *http.Request) {
	// Check the HTTP method
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON data from the request body into the Numbers struct
	var ClassIDs scraper.PostedData
	err := json.NewDecoder(r.Body).Decode(&ClassIDs)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Error parsing request body")
		panic(err)
	}

	searchUrl := appScraper.BuildRequestURL(ClassIDs)
	item := appScraper.PerformRequest(searchUrl, ClassIDs.TermCode, ClassIDs.SubjectCode, ClassIDs.CourseID)
	_, availableSeats := appScraper.ParseJSONBody(ClassIDs.CourseID, item)

	resp := AvailabilityResponse{
		AvailableSeats: availableSeats,
		CourseId:       ClassIDs.CourseID,
		LastUpdated:    item.UpdatedAt,
	}

	json.NewEncoder(w).Encode(resp)
}

func main() {
	err := godotenv.Load(".env")

	if err != nil {
		fmt.Printf("Error loading .env file: %v", err)
	}

	appConfig = config.New()
	fmt.Printf("Config loaded: %v\n", appConfig)

	appCache = cache.New(appConfig)
	appCache.Connect()
	defer appCache.Client.Close()

	appScraper = scraper.New(appCache)

	http.HandleFunc("/", checkAvailability)
	http.HandleFunc("/courses/availability", CheckCoursesAvailability)

	log.Fatal(http.ListenAndServe(":8080", nil))
}
