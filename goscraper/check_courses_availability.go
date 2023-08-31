package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"sync"
)

type CheckRequestItem struct {
	TermCode    string `json:"TermCode"`
	SubjectCode string `json:"SubjectCode"`
	CourseID    string `json:"CourseID"`
}

type CheckRequestItems []CheckRequestItem

type CheckRequest struct {
	Courses CheckRequestItems `json:"courses"`
}

func (cr *CheckRequestItem) CacheKey(urlstr string) string {
	return strings.TrimSuffix(cr.TermCode+":"+cr.SubjectCode+":"+cr.CourseID+":"+urlstr, ":")
}

func CheckCoursesAvailability(w http.ResponseWriter, r *http.Request) {
	// Check the HTTP method
	if r.Method != http.MethodPost {
		w.WriteHeader(http.StatusMethodNotAllowed)
		return
	}

	// Parse the JSON data from the request body into the Numbers struct
	var requests CheckRequestItems
	err := json.NewDecoder(r.Body).Decode(&requests)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		fmt.Fprint(w, "Error parsing request body")
		panic(err)
	}

	resp := []AvailabilityResponse{}
	//items := []cache.CacheItem{}

	var wg sync.WaitGroup

	for _, request := range requests {
		wg.Add(1)
		go func(r CheckRequestItem) {
			defer wg.Done()

			searchUrl := appScraper.SetRequestURL(r.TermCode, r.SubjectCode, r.CourseID)
			item := appScraper.PerformRequest(searchUrl, r.TermCode, r.SubjectCode, r.CourseID)

			_, availableSeats := appScraper.ParseJSONBody(item.CourseId, item)

			resp = append(resp, AvailabilityResponse{
				AvailableSeats: availableSeats,
				CourseId:       item.CourseId,
				LastUpdated:    item.UpdatedAt,
			})

			fmt.Printf("resp == %+v\n", resp)
		}(request)
	}
	wg.Wait()

	// for _, item := range items {
	// 	_, availableSeats := appScraper.ParseJSONBody(item.CourseId, item)

	// 	resp = append(resp, AvailabilityResponse{
	// 		AvailableSeats: availableSeats,
	// 		CourseId:       item.CourseId,
	// 		LastUpdated:    item.UpdatedAt,
	// 	})
	// }

	json.NewEncoder(w).Encode(resp)
}
