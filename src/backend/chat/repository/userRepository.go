package repository

import (
	"database/sql"
	"log"

	"github.com/STOVE-Milk/steam-clone/chat/models"
)

type User struct {
	Id      string `json:"id"`
	Name    string `json:"name"`
	Profile string `json:"profile"`
}

func (user *User) GetId() string {
	return user.Id
}

func (user *User) GetName() string {
	return user.Name
}

func (user *User) GetProfile() string {
	return user.Profile
}

type UserRepository struct {
	Db *sql.DB
}

func (repo *UserRepository) GetFriends(ID string) map[string]models.User {
	friends := make(map[string]models.User)
	rows, err := repo.Db.Query(`
	SELECT u.idx, u.nickname, u.profile FROM steam.friend as f
	join steam.user as u
	on f.friend_id = u.idx
	where f.user_id = ?;
	`, ID)
	if err == sql.ErrNoRows {
		log.Println("등록된 친구가 없습니다.")
		return nil
	} else if err != nil {
		log.Println(err)
		return nil
	}
	for rows.Next() {
		var friend User
		var userProfile models.StringJsonMap
		rows.Scan(&friend.Id, &friend.Name, &userProfile)
		friend.Profile = userProfile["image"].(string)
		friends[friend.GetId()] = &friend
	}
	return friends
}

func (repo *UserRepository) FindUserById(ID string) models.User {
	row := repo.Db.QueryRow("SELECT idx, nickname, profile FROM user where idx = ? LIMIT 1", ID)
	var userProfile models.StringJsonMap
	var user User

	if err := row.Scan(&user.Id, &user.Name, &userProfile); err != nil {
		if err == sql.ErrNoRows {
			return nil
		}
		panic(err)
	}
	user.Profile = userProfile["image"].(string)
	return &user
}
