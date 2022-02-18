package models

type User interface {
	GetId() string
	GetName() string
}

type UserRepository interface {
	FindUserById(ID string) User
	GetFriends(clientId string) map[string]User
}

type UserMRepository interface {
	GetAllJoinedRoom(userId string) []RoomMongo
	AddRoom(room Room, userId string)
	DeleteRoom(room Room, userId string)
	AddUser(userId string)
}

type UserMongo struct {
	Id    string      `bson:"id"`
	Name  string      `bson:"name"`
	Rooms []RoomMongo `bson:"rooms"`
}
