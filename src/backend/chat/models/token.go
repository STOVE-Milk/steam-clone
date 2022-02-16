package models

import (
	"errors"
	"fmt"
	"net/http"
	"strconv"

	"github.com/dgrijalva/jwt-go"
)

type TokenMetaData struct {
	UserId   string
	Nickname string
	Role     int32
	Country  string
}

func ExtractMetadata(r *http.Request) (*TokenMetaData, error) {
	metadata := &TokenMetaData{}
	tokenString := r.URL.Query()["token"]
	if tokenString == nil {
		return nil, errors.New("token.ExtractMetadata : 토큰 에러")
	}
	secretString := "5dc5085d01e85fd229e32fedbd0f1a4b10cd57e61a7f423bca91263d7ce22ac5cf298a1f8ecc5f5f8125b07627329d06cbde50d25b5d00a17286cf577fd86e8b"
	secret := []byte(secretString)
	token, _ := jwt.Parse(tokenString[0], func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})

	claims, _ := token.Claims.(jwt.MapClaims)

	userId, ok := claims["idx"]
	if !ok {
		return nil, errors.New("no user id")
	}
	nickname, ok := claims["nickname"].(string)
	if !ok {
		return nil, errors.New("no nickname")
	}
	country, ok := claims["country"].(string)
	if !ok {
		return nil, errors.New("no country")
	}
	role, ok := claims["role"]
	if !ok {
		return nil, errors.New("no role")
	}
	metadata.UserId = strconv.Itoa(int(userId.(float64)))
	metadata.Nickname = nickname
	metadata.Role = int32(role.(float64))
	metadata.Country = country
	return metadata, nil
}
