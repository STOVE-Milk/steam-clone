import { createAsyncAction } from 'typesafe-actions';
import { AxiosError, AxiosResponse } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';
import { IResType } from 'api/game/type';
import { IDoWishReqType, IDoUnWishReqType } from 'api/wishlist/type';

export const [DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL] = createRequestActionTypes('DO_WISH');
export const [DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL] = createRequestActionTypes('DO_UNWISH');

export const doWish = createAsyncAction(DO_WISH, DO_WISH_SUCCESS, DO_WISH_FAIL)<IDoWishReqType, IResType, AxiosError>();

export const doUnWish = createAsyncAction(DO_UNWISH, DO_UNWISH_SUCCESS, DO_UNWISH_FAIL)<
  IDoUnWishReqType,
  IResType,
  AxiosError
>();
