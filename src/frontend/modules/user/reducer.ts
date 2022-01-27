import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { userState } from './types';
import { GET_GIFTCARDLIST, GET_GIFTCARDLIST_SUCCESS, GET_GIFTCARDLIST_FAIL } from './actions';
import { initialGiftCard } from './initalData';

const initialState: userState = {
  giftCardList: asyncState.initial(initialGiftCard),
};

const reducer = createReducer<userState>(initialState, {
  [GET_GIFTCARDLIST]: (state, action) => ({
    ...state,
    giftcardList: asyncState.load(action.payload),
  }),
  [GET_GIFTCARDLIST_SUCCESS]: (state, action) => ({
    ...state,
    giftcardList: asyncState.success(action.payload),
  }),
  [GET_GIFTCARDLIST_FAIL]: (state, action) => ({
    ...state,
    giftcardList: asyncState.error(action.payload),
  }),
});

export default reducer;
