package models

type User interface {
	GetId() string
	GetName() string
}

type UserRepository interface {
	FindUserById(ID string) User
	GetAllUsers() []User
}

type UserMRepository interface {
	GetAllJoinedRoom(user User) []Room
	AddRoom(room Room, user User)
	DeleteRoom(room Room, user User)
	AddUser(user User)
}
