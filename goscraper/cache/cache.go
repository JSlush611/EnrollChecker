package cache

type CacheItem struct {
	Value     string //[]byte
	Code      int
	UpdatedAt int64
	CourseId  string
}
