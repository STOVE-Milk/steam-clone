import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IReqType } from 'api/type';
import { IResType, IResStoreType } from 'api/game/type';
import { IAddCartInfoReqType, IRmCartInfoReqType } from 'api/cart/type';
import { IDoWishReqType, IDoUnWishReqType } from 'api/wishlist/type';

export const [ADD_CARTINFO, ADD_CARTINFO_SUCCESS, ADD_CARTINFO_FAIL] = createRequestActionTypes('ADD_CARTINFO');
export const [RM_CARTINFO, RM_CARTINFO_SUCCESS, RM_CARTINFO_FAIL] = createRequestActionTypes('RM_CARTINFO');
export const [DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL] = createRequestActionTypes('DO_WISH');
export const [DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL] = createRequestActionTypes('DO_UNWISH');
export const [GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL] = createRequestActionTypes('GET_USERDATA');
export const [GET_WISHLIST, GET_WISHLIST_SUCCESS, GET_WISHLIST_FAIL] = createRequestActionTypes('GET_WISHLIST');

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
