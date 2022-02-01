package models

type User interface {
	GetId() string
	GetName() string
}

type UserRepository interface {
	FindUserById(ID string) User
	GetAllUsers() []User
}
