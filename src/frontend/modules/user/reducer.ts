import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { userState } from './types';
import {
  GET_GIFTCARDLIST,
  GET_GIFTCARDLIST_SUCCESS,
  GET_GIFTCARDLIST_FAIL,
  DO_CHARGE,
  DO_CHARGE_SUCCESS,
  DO_CHARGE_FAIL,
} from './actions';
import { initialGiftCard, initialChargeInfo } from './initalData';

const initialState: userState = {
  giftCardList: asyncState.initial(initialGiftCard),
  charge: asyncState.initial(initialChargeInfo),
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
    giftCardList: asyncState.error(action.payload),
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
    charge: asyncState.error(action.payload),
  }),
});

export default reducer;
