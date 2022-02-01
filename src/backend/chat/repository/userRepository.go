package repository

import (
	"database/sql"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/models"
)

type User struct {
	Id   int32  `json:"id"`
	Name string `json:"name"`
}

func (user *User) GetId() string {
	return string(user.Id)
}

func (user *User) GetName() string {
	return user.Name
}

type UserRepository struct {
	Db *sql.DB
}

func (repo *UserRepository) AddUser(user models.User) {

}

func (repo *UserRepository) RemoveUser(user models.User) {

}

func (repo *UserRepository) FindUserById(ID string) models.User {

	row := repo.Db.QueryRow("SELECT id, nickname FROM user where id = ? LIMIT 1", ID)

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

	rows, err := repo.Db.Query("SELECT id, nickname FROM user")

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
