import { createAsyncAction } from 'typesafe-actions';
import { AxiosError } from 'axios';

import { createRequestActionTypes } from 'modules/utils/actionUtils';

import { IGetGiftCardListReqType, IResType, IDoChargeReqType, IDoApprovalChargeReqType } from 'pages/api/user/type';

export const [GET_GIFTCARDLIST, GET_GIFTCARDLIST_SUCCESS, GET_GIFTCARDLIST_FAIL] =
  createRequestActionTypes('GET_GIFTCARDLIST');
export const [DO_CHARGE, DO_CHARGE_SUCCESS, DO_CHARGE_FAIL] = createRequestActionTypes('DO_CHARGE');
export const [DO_APPROVAL_CHARGE, DO_APPROVAL_CHARGE_SUCCESS, DO_APPROVAL_CHARGE_FAIL] =
  createRequestActionTypes('DO_APPROVAL_CHARGE');

export const getGiftCardList = createAsyncAction(GET_GIFTCARDLIST, GET_GIFTCARDLIST_SUCCESS, GET_GIFTCARDLIST_FAIL)<
  IGetGiftCardListReqType,
  IResType,
  AxiosError
>();

export const doCharge = createAsyncAction(DO_CHARGE, DO_CHARGE_SUCCESS, DO_CHARGE_FAIL)<
  IDoChargeReqType,
  IResType,
  AxiosError
>();

export const doApprovalCharge = createAsyncAction(
  DO_APPROVAL_CHARGE,
  DO_APPROVAL_CHARGE_SUCCESS,
  DO_APPROVAL_CHARGE_FAIL,
)<IDoApprovalChargeReqType, IResType, AxiosError>();
