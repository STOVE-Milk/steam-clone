package config

import (
	"database/sql"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

func InitDB() *sql.DB {
	db, err := sql.Open("mysql", "root:12345678@tcp(127.0.0.1:3306)/test")
	if err != nil {
		log.Fatal(err)
	}

	return db
}
