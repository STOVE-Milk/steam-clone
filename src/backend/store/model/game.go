package model

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"strings"
	"time"

	pb "github.com/STOVE-Milk/steam-clone/store/proto"
)

type GameRepository interface {
	GetCategoryList() []string
	GetGameListByCategory(category string) []*pb.GameSimple
	GetGameDetail(gameId int) *pb.GameDetail
	// GetReviewList()
	// GetGameListInWishlist()
	// GetDiscountingGameList()
}

type StringSlice []byte

func (ss StringSlice) ToSlice() []string {
	data := string(ss)
	data = data[1 : len(data)-1]
	splitedData := strings.Split(data, ",")

	return splitedData
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

type rawTime []byte

func (t rawTime) Time() (time.Time, error) {
	return time.Parse("15:04:05", string(t))
}

type Review struct {
	Id             int     `json:"idx"`
	UserId         int     `json:"user_id"`
	DisplayedName  string  `json:"displayed_name"`
	Content        string  `json:"content"`
	Recommendation int     `json:"recommendation"`
	CreatedAt      rawTime `json:"created_at"`
}

type GameDetail struct {
	GameSimple
	Description    string      `json:"description"`
	PublisherId    int         `json:"publisher"`
	ReviewCount    int         `json:"review_count"`
	RecommendCount int         `json:"recommend_count"`
	Language       StringSlice `json:"language"`
}

type GameSimple struct {
	Id                 int           `json:"game_id"`
	Name               string        `json:"name"`
	DescriptionSnippet string        `json:"description_snippet"`
	Price              int           `json:"price"`
	Sale               int           `json:"sale"`
	Image              StringJsonMap `json:"image"`
	Video              StringJsonMap `json:"video"`
	Os                 StringSlice   `json:"os"`
	DownloadCount      int           `json:"download_cnt"`
}

type Category struct {
	Id        int    `json:"idx"`
	ParentIdx int    `json:"parent_id"`
	Name      string `json:"name"`
}

type Publisher struct {
	Id     int    `json:"idx"`
	UserId int    `json:"user_id"`
	Name   string `json:"name"`
	Title  string `json:"title"`
}
