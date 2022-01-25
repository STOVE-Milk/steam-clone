package dummy

import (
	storePb "github.com/STOVE-Milk/steam-clone/store/proto"
)

var GameSimpleList = []*storePb.GameSimple{
	{
		Id:                 1,
		Name:               "로스트 아크",
		Price:              20000,
		DescriptionSnippet: "아자아자",
		Sale:               20,
		Image:              &storePb.ContentsPath{Main: "localhost/content/1", Sub: []string{"localhost/content/11,localhost/content/12,localhost/content/13"}},
		Video:              &storePb.ContentsPath{Main: "localhost/content/2", Sub: []string{"localhost/content/21,localhost/content/22,localhost/content/23"}},
		CategoryList:       []string{"핵&스래쉬", "MMORPG"},
	},
	{
		Id:                 2,
		Name:               "리그오브레전드",
		Price:              25000,
		DescriptionSnippet: "스트레스",
		Sale:               10,
		Image:              &storePb.ContentsPath{Main: "localhost/content/3", Sub: []string{"localhost/content/31"}},
		Video:              &storePb.ContentsPath{Main: "localhost/content/4", Sub: []string{"localhost/content/41,localhost/content/42,localhost/content/43,localhost/content/44,localhost/content/45,localhost/content/46,localhost/content/47,localhost/content/48,localhost/content/49,localhost/content/40"}},
		CategoryList:       []string{"롤플레잉", "AOS"},
	},
}
