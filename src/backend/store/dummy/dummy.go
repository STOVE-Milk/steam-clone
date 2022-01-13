package dummy

import (
	pb "github.com/STOVE-Milk/steam-clone/store/proto"
)

// type GameSimple struct {
// 	Name               string           `json:"name"`
// 	DescriptionSnippet string           `json:"description_snippet"`
// 	Price              map[string]int32 `json:"price"`
// 	Sale               int32            `json:"sale"`
// 	Images             ContentsPath     `json:"images"`
// 	Videos             ContentsPath     `json:"videos"`
// 	CategoryList       []string         `json:"category_list"`
// }
// type ContentsPath struct {
// 	Main string   `json:"main"`
// 	Sub  []string `json:"sub"`
// }

var GameSimpleList = []*pb.GameSimple{
	{
		Name:               "로스트 아크",
		Price:              map[string]int32{"kr": 20000},
		DescriptionSnippet: "빛강선 최고",
		Sale:               20,
		Image:              &pb.ContentsPath{Main: "localhost/content/1", Sub: []string{"localhost/content/11,localhost/content/12,localhost/content/13"}},
		Video:              &pb.ContentsPath{Main: "localhost/content/2", Sub: []string{"localhost/content/21,localhost/content/22,localhost/content/23"}},
		CategoryList:       []string{"핵&스래쉬", "MMORPG"},
	},
	{
		Name:               "리그오브레전드",
		Price:              map[string]int32{"kr": 25000},
		DescriptionSnippet: "스트레스",
		Sale:               10,
		Image:              &pb.ContentsPath{Main: "localhost/content/3", Sub: []string{"localhost/content/31"}},
		Video:              &pb.ContentsPath{Main: "localhost/content/4", Sub: []string{"localhost/content/41,localhost/content/42,localhost/content/43,localhost/content/44,localhost/content/45,localhost/content/46,localhost/content/47,localhost/content/48,localhost/content/49,localhost/content/40"}},
		CategoryList:       []string{"롤플레잉", "AOS"},
	},
}
