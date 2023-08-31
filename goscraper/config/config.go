package config

import "os"

type Config struct {
	RedisAddress  string
	RedisUsername string
	RedisPassword string
	RedisPort     string
	DefaultTtl    int
}

func New() *Config {
	result := &Config{
		DefaultTtl: 60,
	}
	result.loadEnv()

	return result
}

func (c *Config) loadEnv() {
	c.RedisUsername = os.Getenv("REDIS_USER_NAME")
	c.RedisPassword = os.Getenv("REDIS_USER_PASSWORD")
	c.RedisAddress = os.Getenv("REDIS_ADDRESS")
	c.RedisPort = os.Getenv("REDIS_PORT")
}
