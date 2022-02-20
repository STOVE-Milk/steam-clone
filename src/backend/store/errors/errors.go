package errors

import (
	"github.com/STOVE-Milk/steam-clone/store/models"
)

// ERR를 관리하는 패키지 입니다.
// 변수 Errors에 저장된 error 데이터를 모든 곳에서 사용하게 됩니다.

const (
	GetReviewQueryErr               = "GET_REVIEW_QUERY_ERR"
	GetPublisherQueryErr            = "GET_PUBLISHER_QUERY_ERR"
	GetGameDetailQueryErr           = "GET_GAME_DETAIL_QUERY_ERR"
	GetSotingGameListQueryErr       = "GET_SORTING_GAME_LIST_QUERY_ERR"
	GetCategoryListQueryErr         = "GET_CATEGORY_LIST_QUERY_ERR"
	GetCategoryListByGameIdQueryErr = "GET_CATEGORY_LIST_BY_GAME_ID_QUERY_ERR"
	GetGameListInWishlistQueryErr   = "GET_GAME_LIST_IN_WISHLIST_QUERY_ERR"
	GetGameListInCartQueryErr       = "GET_GAME_LIST_IN_CART_QUERY_ERR"
	GetPurchaseGameListQueryErr     = "GET_PURCHASE_GAME_LIST_QUERY_ERR"
	GetWishListQueryErr             = "GET_WISHLIST_QUERY_ERR"
	GetSearchingGameListQueryErr    = "GET_SEARCHING_GAMELIST_QUERY_ERR"
	GameInstallQueryErr             = "GAME_INSTALL_QUERY_ERR"
	GameUninstallQueryErr           = "GAME_UNINSTALL_QUERY_ERR"

	GetReviewScanErr               = "GET_REVIEW_SCAN_ERR"
	GetPublisherScanErr            = "GET_PUBLISHER_SCAN_ERR"
	GetGameDetailScanErr           = "GET_GAME_DETAIL_SCAN_ERR"
	GetSotingGameListScanErr       = "GET_SORTING_GAME_LIST_SCAN_ERR"
	GetCategoryListScanErr         = "GET_CATEGORY_LIST_SCAN_ERR"
	GetCategoryListByGameIdScanErr = "GET_CATEGORY_LIST_BY_GAME_ID_SCAN_ERR"
	GetGameListInWishlistScanErr   = "GET_GAME_LIST_IN_WISHLIST_SCAN_ERR"
	GetGameListInCartScanErr       = "GET_GAME_LIST_IN_CART_SCAN_ERR"
	GetPurchaseGameListScanErr     = "GET_PURCHASE_GAME_LIST_SCAN_ERR"
	GetWishListScanErr             = "GET_WISHLIST_SCAN_ERR"
	GetSearchingGameListScanErr    = "GET_SEARCHING_GAMELIST_SCAN_ERR"

	PostReviewQueryErr   = "POST_REIVEW_QUERY_ERR"
	PostWishListQueryErr = "POST_WISHLIST_QUERY_ERR"

	PatchReviewQueryErr = "PATCH_REVIEW_QUERY_ERR"

	DeleteReviewQueryErr   = "DELETE_REVIEW_QUERY_ERR"
	DeleteWishListQueryErr = "DELETE_WISHLIST_QUERY_ERR"

	AlreadyGameInstallErr   = "ALREADY_GAME_INSTALL_ERR"
	AlreadyGameUninstallErr = "ALREADY_GAME_UNINSTALL_ERR"

	NullMetaDataErr = "NULL_TOKEN_METADATA_ERR"
	NullTokenErr    = "NULL_TOKEN_ERR"

	EmptyGameDataErr = "EMPTY_GAME_DATA_ERR"
	EmptyCartErr     = "EMPTY_CART_ERR"
)

var Errors map[string]*models.Error
