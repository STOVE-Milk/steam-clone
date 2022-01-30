import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import {
  IGetCategoriesReqType,
  IGetGameReqType,
  IGetGamesByCategoryReqType,
  IGetWishListDataReqType,
  IGetWishListReqType,
  IGetUserDataReqType,
  IResType,
} from 'pages/api/game/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const [GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL] = createRequestActionTypes('GET_GAME');
export const [GET_GAMESBYCATEGORY, GET_GAMESBYCATEGORY_SUCCESS, GET_GAMESBYCATEGORY_FAIL] =
  createRequestActionTypes('GET_GAMESBYCATEGORY');
export const [GET_WISHLIST, GET_WISHLIST_SUCCESS, GET_WISHLIST_FAIL] = createRequestActionTypes('GET_WISHLIST');
export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');
export const [GET_WISHLISTDATA, GET_WISHLISTDATA_SUCCESS, GET_WISHLISTDATA_FAIL] =
  createRequestActionTypes('GET_WISHLISTDATA');

export const getCategories = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL)<
  IGetCategoriesReqType,
  IResType,
  AxiosError
>();

export const getGame = createAsyncAction(GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL)<
  IGetGameReqType,
  IResType,
  AxiosError
>();

export const getGamesByCategory = createAsyncAction(
  GET_GAMESBYCATEGORY,
  GET_GAMESBYCATEGORY_SUCCESS,
  GET_GAMESBYCATEGORY_FAIL,
)<IGetGamesByCategoryReqType, IResType, AxiosError>();

export const getWishListData = createAsyncAction(GET_WISHLISTDATA, GET_WISHLISTDATA_SUCCESS, GET_WISHLISTDATA_FAIL)<
  IGetWishListDataReqType,
  IResType,
  AxiosError
>();

export const getWishList = createAsyncAction(GET_WISHLIST, GET_WISHLIST_SUCCESS, GET_WISHLIST_FAIL)<
  IGetWishListReqType,
  IResType,
  AxiosError
>();

export const getUserData = createAsyncAction(GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL)<
  IGetUserDataReqType,
  IResType,
  AxiosError
>();
