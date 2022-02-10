import { createReducer } from 'typesafe-actions';
import { asyncState } from 'modules/utils/reducerUtils';
import { IUserState } from './types';
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
  DO_SIGNUP,
  DO_SIGNUP_SUCCESS,
  DO_SIGNUP_FAIL,
  SAVE_USERINFO,
  SAVE_USERINFO_SUCCESS,
  SAVE_USERINFO_FAIL,
} from './actions';
import { initialGiftCard, initialChargeInfo, initialApprovalCharge, initialSingup, initalUserInfo } from './initalData';

const initialState: IUserState = {
  signup: asyncState.initial(initialSingup),
  userInfo: asyncState.initial(initalUserInfo),
  giftCardList: asyncState.initial(initialGiftCard),
  charge: asyncState.initial(initialChargeInfo),
  approvalCharge: asyncState.initial(initialApprovalCharge),
};

const reducer = createReducer<userState>(initialState, {
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
  [DO_SIGNUP]: (state, action) => ({
    ...state,
    signup: asyncState.load(initialSingup),
  }),
  [DO_SIGNUP_SUCCESS]: (state, action) => ({
    ...state,
    signup: asyncState.success(action.payload),
  }),
  [DO_SIGNUP_FAIL]: (state, action) => ({
    ...state,
    signup: asyncState.error(initialSingup, action.payload),
  }),
  [SAVE_USERINFO]: (state, action) => ({
    ...state,
    userInfo: asyncState.load(initalUserInfo),
  }),
  [SAVE_USERINFO_SUCCESS]: (state, action) => ({
    ...state,
    userInfo: asyncState.success(action.payload),
  }),
  [SAVE_USERINFO_FAIL]: (state, action) => ({
    ...state,
    userInfo: asyncState.error(initalUserInfo, action.payload),
  }),
});

export default reducer;
