package token

import (
	"context"
	"errors"
	"fmt"
	"strings"

	"github.com/STOVE-Milk/steam-clone/store/config"
	storeErr "github.com/STOVE-Milk/steam-clone/store/errors"
	"github.com/STOVE-Milk/steam-clone/store/models"
	"github.com/STOVE-Milk/steam-clone/store/utils"
	"github.com/dgrijalva/jwt-go"
	"google.golang.org/grpc/metadata"
)

func extractToken(ctx context.Context) string {
	headers, _ := metadata.FromIncomingContext(ctx)
	if len(headers["authorization"]) == 0 {
		return ""
	}

	bearToken := headers["authorization"][0]
	//normally Authorization the_token_xxx
	strArr := strings.Split(bearToken, " ")
	if len(strArr) == 2 {
		return strArr[1]
	}
	return ""
}

func ExtractMetadata(ctx context.Context) (*models.TokenMetaData, *models.Error) {
	metadata := &models.TokenMetaData{}
	tokenString := extractToken(ctx)
	if tokenString == "" {
		return nil, utils.ErrorHandler(storeErr.NullTokenErr, errors.New("토큰값이 입력되지 않음"))
	}
	secretString := config.GetSecretKey()
	secret := []byte(secretString)
	token, _ := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return secret, nil
	})

	claims, _ := token.Claims.(jwt.MapClaims)

	userId, ok := claims["idx"]
	if !ok {
		return nil, utils.ErrorHandler(storeErr.NullMetaDataErr, errors.New("토큰 값 중 user 값이 없음"))
	}
	nickname, ok := claims["nickname"].(string)
	if !ok {
		return nil, utils.ErrorHandler(storeErr.NullMetaDataErr, errors.New("토큰 값 중 nickname 값이 없음"))
	}
	country, ok := claims["country"].(string)
	if !ok {
		return nil, utils.ErrorHandler(storeErr.NullMetaDataErr, errors.New("토큰 값 중 country 값이 없음"))
	}
	role, ok := claims["role"]
	if !ok {
		return nil, utils.ErrorHandler(storeErr.NullMetaDataErr, errors.New("토큰 값 중 role 값이 없음"))
	}
	metadata.UserId = int32(userId.(float64))
	metadata.Nickname = nickname
	metadata.Role = int32(role.(float64))
	metadata.Country = country
	return metadata, nil
}
