import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import { IGetGiftCardListReqType, IResType } from 'pages/api/user/type';

export const [GET_GIFTCARDLIST, GET_GIFTCARDLIST_SUCCESS, GET_GIFTCARDLIST_FAIL] =
  createRequestActionTypes('GET_GIFTCARDLIST');

export const getGiftCardList = createAsyncAction(GET_GIFTCARDLIST, GET_GIFTCARDLIST_SUCCESS, GET_GIFTCARDLIST_FAIL)<
  IGetGiftCardListReqType,
  IResType,
  AxiosError
>();
