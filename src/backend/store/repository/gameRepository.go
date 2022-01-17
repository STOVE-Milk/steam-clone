package repository

import (
	"context"
	"database/sql"
	"database/sql/driver"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"time"
)

type StringJsonMap map[string]interface{}

type GameRepository struct {
	Db *sql.DB
}

type Category struct {
	Idx       int    `json:"idx"`
	ParentIdx int    `json:"parent_id"`
	Name      string `json:"name"`
}

type GameSimple struct {
	Id                 int           `json:"game_id"`
	Name               string        `json:"name"`
	DescriptionSnippet string        `json:"description_snippet"`
	Price              int           `json:"price"`
	Sale               int           `json:"sale"`
	Image              StringJsonMap `json:"image"`
	Video              StringJsonMap `json:"video"`
	// Os                 []interface{}          `json:"os"`
}

type gameSimple struct {
	*GameSimple
	Image json.RawMessage
	Video json.RawMessage
	Os    json.RawMessage
}

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

func (repo *GameRepository) GetGameListByCategory(ctx context.Context, category string) ([]*GameSimple, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var gameSimpleList []*GameSimple
	rows, err := repo.Db.QueryContext(ctx, `	
	SELECT game_id, name, description_snippet, price, sale, image, video
	FROM steam.game_category AS gc 
	join steam.game AS g 
	on gc.game_id=g.idx where gc.category_name=?
	LIMIT 5
	`, category)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var game GameSimple
		err := rows.Scan(&game.Id, &game.Name, &game.DescriptionSnippet, &game.Price, &game.Sale, &game.Image, &game.Video)
		if err != nil {
			log.Fatal(err)
		}
		fmt.Println(game)
		gameSimpleList = append(gameSimpleList, &game)
	}
	return gameSimpleList, nil
}

func (repo *GameRepository) GetCategoryList(ctx context.Context) ([]*Category, error) {
	ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
	defer cancel()
	var categoryList []*Category
	rows, err := repo.Db.QueryContext(ctx, "SELECT idx, parent_id, name FROM category WHERE idx=parent_id")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var category Category
		rows.Scan(&category.Idx, &category.ParentIdx, &category.Name)
		categoryList = append(categoryList, &category)
	}
	return categoryList, nil
}
