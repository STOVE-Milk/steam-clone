package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func InitDB() *sql.DB {
	db, err := sql.Open("mysql", "milk:milk@tcp(54.180.117.120:3306)/steam")
	if err != nil {
		log.Fatal(err)
	}

	return db
}
