package config

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"os"

	"github.com/STOVE-Milk/steam-clone/store/models"
)

func readErrorJson() *os.File {
	jsonFile, err := os.Open("../../common/ErrorCode.json")
	if err != nil {
		log.Panic(err)
	}
	return jsonFile
}

func InitError() models.StoreError {
	jsonFile := readErrorJson()
	defer jsonFile.Close()
	var e models.StoreError
	byteValue, err := ioutil.ReadAll(jsonFile)
	if err != nil {
		log.Panic(err)
	}
	json.Unmarshal(byteValue, &e)

	return e
}
