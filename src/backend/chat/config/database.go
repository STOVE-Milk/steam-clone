package config

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/joho/godotenv"
)

type dbConfig struct {
	dbHost string
	dbName string
	dbPort string
	dbUser string
	dbPwd  string
}

func (cfg dbConfig) String() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%s)/%s?parseTime=true", cfg.dbUser, cfg.dbPwd, cfg.dbHost, cfg.dbPort, cfg.dbName)
}

func makeDbConfig() string {
	err := godotenv.Load(".env")
	if err != nil {
		log.Panic(err)
	}
	cfg := &dbConfig{
		dbHost: os.Getenv("DBHOST"),
		dbName: os.Getenv("DBNAME"),
		dbPort: os.Getenv("DBPORT"),
		dbUser: os.Getenv("DBUSER"),
		dbPwd:  os.Getenv("DBPWD"),
	}
	return string(cfg.String())
}

func InitDB() *sql.DB {
	db, err := sql.Open("mysql", makeDbConfig())
	if err != nil {
		log.Fatal(err)
	}

	return db
}
