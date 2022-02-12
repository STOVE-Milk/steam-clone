import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import { IReqType } from 'api/type';
import {
  IGetGameReqType,
  IGetGamesByCategoryReqType,
  IResType,
  IResStoreType,
  IGetGameInfoByIdListReqType,
} from 'api/game/type';

import { IAddCartInfoReqType, IRmCartInfoReqType } from 'api/cart/type';
import { IDoWishReqType, IDoUnWishReqType } from 'api/wishlist/type';

export const [GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL] = createRequestActionTypes('GET_CATEGORIES');
export const [GET_GAME, GET_GAME_SUCCESS, GET_GAME_FAIL] = createRequestActionTypes('GET_GAME');
export const [GET_GAMESBYCATEGORY, GET_GAMESBYCATEGORY_SUCCESS, GET_GAMESBYCATEGORY_FAIL] =
  createRequestActionTypes('GET_GAMESBYCATEGORY');
export const [ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL] = createRequestActionTypes('ADD_CARTINFO');
export const [RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL] = createRequestActionTypes('RM_CARTINFO');
export const [GET_GAMEINFOBYIDLIST, GET_GAMEINFOBYIDLIST_SUCCESS, GET_GAMEINFOBYIDLIST_FAIL] =
  createRequestActionTypes('GET_GAMEINFOBYIDLIST');
export const [DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL] = createRequestActionTypes('DO_WISH');
export const [DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL] = createRequestActionTypes('DO_UNWISH');
export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');
export const [GET_WISHLIST, GET_WISHLIST_SUCCESS, GET_WISHLIST_FAIL] = createRequestActionTypes('GET_WISHLIST');

export const getCategories = createAsyncAction(GET_CATEGORIES, GET_CATEGORIES_SUCCESS, GET_CATEGORIES_FAIL)<
  IReqType,
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

export const addCartInfo = createAsyncAction(ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL)<
  IAddCartInfoReqType,
  IResStoreType,
  AxiosError
>();

export const rmCartInfo = createAsyncAction(RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL)<
  IRmCartInfoReqType,
  IResStoreType,
  AxiosError
>();
export const getGameInfoByIdList = createAsyncAction(
  GET_GAMEINFOBYIDLIST,
  GET_GAMEINFOBYIDLIST_SUCCESS,
  GET_GAMEINFOBYIDLIST_FAIL,
)<IGetGameInfoByIdListReqType, IResType, AxiosError>();
export const getWishList = createAsyncAction(GET_WISHLIST, GET_WISHLIST_SUCCESS, GET_WISHLIST_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();

export const doWish = createAsyncAction(DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL)<IDoWishReqType, IResType, AxiosError>();

export const doUnWish = createAsyncAction(DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL)<
  IDoUnWishReqType,
  IResType,
  AxiosError
>();

export const getUserData = createAsyncAction(GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL)<
  IReqType,
  IResType,
  AxiosError
>();
