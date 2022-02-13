package models

type Error struct {
	Code        int    `json:"code"`
	Message     string `json:"message"`
	Description string `json:"description"`
}

type StoreError struct {
	StoreError map[string]*Error `json:"store"`
}
