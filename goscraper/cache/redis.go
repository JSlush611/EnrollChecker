package cache

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/JSlush611/EnrollChecker/scraper/config"
	"github.com/go-redis/redis"
)

// var client *redis.Client

type Cache struct {
	Client *redis.Client
	Config *config.Config
}

func New(config *config.Config) *Cache {
	return &Cache{
		Client: nil,
		Config: config,
	}
}

func (c *Cache) Connect() {
	opt, err := redis.ParseURL(fmt.Sprintf("redis://%s:%s@%s:%s", c.Config.RedisUsername, c.Config.RedisPassword, c.Config.RedisAddress, c.Config.RedisPort))
	if err != nil {
		panic(err)
	}
	opt.DB = 0

	fmt.Printf("opt == %+v\n", opt)

	c.Client = redis.NewClient(opt)

	_, err = c.Client.Ping().Result()
	if err != nil {
		panic(err)
	}
}

func (c *Cache) Set(key string, value *CacheItem, duration time.Duration) error {
	if c.Client == nil {
		return errors.New("Redis client not initialized")
	}

	data, err := json.Marshal(value)
	if err != nil {
		return err
	}

	err = c.Client.Set(key, data, duration).Err()
	if err != nil {
		return err
	}

	return nil
}

func (c *Cache) Has(key string) bool {
	if c.Client == nil {
		return false
	}

	_, err := c.Client.Get(key).Result()
	return err == nil
}

func (c *Cache) Get(key string) (*CacheItem, error) {
	if c.Client == nil {
		return nil, errors.New("Redis client not initialized")
	}

	val, err := c.Client.Get(key).Result()
	if err != nil {
		return nil, err
	}

	var item CacheItem
	err = json.Unmarshal([]byte(val), &item)
	if err != nil {
		return nil, err
	}

	return &item, nil
}
