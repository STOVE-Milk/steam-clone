package models

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
)

type User interface {
	GetId() string
	GetName() string
	GetProfile() string
}

type UserRepository interface {
	FindUserById(ID string) User
	GetFriends(clientId string) map[string]User
}

type UserMRepository interface {
	GetAllJoinedRoom(user User) []RoomMongo
	AddRoom(room Room, user User)
	DeleteRoom(room Room, user User)
	AddUser(user User)
}

type UserMongo struct {
	Id      string      `bson:"id" json:"id"`
	Name    string      `bson:"name" json:"name"`
	Profile string      `bson:"profile" json:"profile"`
	Rooms   []RoomMongo `bson:"rooms" json:"rooms,omitempty"`
}

type StringJsonMap map[string]interface{}

func (m StringJsonMap) Value() (driver.Value, error) {
	if len(m) == 0 {
		return nil, nil
	}
	j, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}
	return driver.Value([]byte(j)), nil
}

func (m *StringJsonMap) Scan(src interface{}) error {
	var source []byte
	_m := make(map[string]interface{})

	switch src.(type) {
	case []uint8:
		source = []byte(src.([]uint8))
	case nil:
		return nil
	default:
		return errors.New("incompatible type for StringInterfaceMap")
	}
	err := json.Unmarshal(source, &_m)
	if err != nil {
		return err
	}
	*m = StringJsonMap(_m)
	return nil
}
