package repository

import (
	"database/sql"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/models"
)

type User struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

func (user *User) GetId() string {
	return user.Id
}

func (user *User) GetName() string {
	return user.Name
}

type UserRepository struct {
	Db *sql.DB
}

func (repo *UserRepository) GetUserFriends(ID string) []models.User {
	var friends []models.User

	rows, err := repo.Db.Query("SELECT idx, nickname FROM user")
	if err == sql.ErrNoRows {
		log.Println("등록된 친구가 없습니다.")
		return nil
	} else if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var friend User
		rows.Scan(&friend.Id, &friend.Name)
		friends = append(friends, &friend)
	}
	return friends
}

func (repo *UserRepository) FindUserById(ID string) models.User {

	row := repo.Db.QueryRow("SELECT idx, nickname FROM user where idx = ? LIMIT 1", ID)

	var user User

	if err := row.Scan(&user.Id, &user.Name); err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		panic(err)
	}

	return &user

}

func (repo *UserRepository) GetAllUsers() []models.User {

	rows, err := repo.Db.Query("SELECT idx, nickname FROM user")

	if err != nil {
		log.Fatal(err)
	}
	var users []models.User
	defer rows.Close()
	for rows.Next() {
		var user User
		rows.Scan(&user.Id, &user.Name)
		users = append(users, &user)
	}

	return users
}
