import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { IChargeState } from './types';
import {
  GET_GIFTCARDLIST,
  GET_GIFTCARDLIST_SUCCESS,
  GET_GIFTCARDLIST_FAIL,
  DO_CHARGE,
  DO_CHARGE_SUCCESS,
  DO_CHARGE_FAIL,
  DO_APPROVAL_CHARGE,
  DO_APPROVAL_CHARGE_SUCCESS,
  DO_APPROVAL_CHARGE_FAIL,
} from './actions';
import { initialGiftCard, initialChargeInfo, initialApprovalCharge } from './initalData';

const initialState: IChargeState = {
  giftCardList: asyncState.initial(initialGiftCard),
  charge: asyncState.initial(initialChargeInfo),
  approvalCharge: asyncState.initial(initialApprovalCharge),
};

const reducer = createReducer<IChargeState>(initialState, {
  [GET_GIFTCARDLIST]: (state, action) => ({
    ...state,
    giftCardList: asyncState.load(action.payload),
  }),
  [GET_GIFTCARDLIST_SUCCESS]: (state, action) => ({
    ...state,
    giftCardList: asyncState.success(action.payload.data),
  }),
  [GET_GIFTCARDLIST_FAIL]: (state, action) => ({
    ...state,
    giftCardList: asyncState.error(initialGiftCard, action.payload),
  }),
  [DO_CHARGE]: (state, action) => ({
    ...state,
    charge: asyncState.load(action.payload),
  }),
  [DO_CHARGE_SUCCESS]: (state, action) => ({
    ...state,
    charge: asyncState.success(action.payload.data),
  }),
  [DO_CHARGE_FAIL]: (state, action) => ({
    ...state,
    charge: asyncState.error(initialChargeInfo, action.payload),
  }),
  [DO_APPROVAL_CHARGE]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.load(action.payload),
  }),
  [DO_APPROVAL_CHARGE_SUCCESS]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.success(action.payload.data),
  }),
  [DO_APPROVAL_CHARGE_FAIL]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.error(initialApprovalCharge, action.payload),
  }),
});

export default reducer;
