import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { initalFriendInfo } from './initalData';
import { IFriendState } from './types';
import { GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL } from './actions';

const initialState: IFriendState = {
  friends: asyncState.initial(initalFriendInfo),
};

const reducer = createReducer<IFriendState>(initialState, {
  [GET_FRIEND]: (state, action) => ({
    ...state,
    friends: asyncState.load(initalFriendInfo),
  }),
  [GET_FRIEND_SUCCESS]: (state, action) => ({
    ...state,
    friends: asyncState.success(action.payload),
  }),
  [GET_FRIEND_FAIL]: (state, action) => ({
    ...state,
    friends: asyncState.error(initalFriendInfo, action.payload),
  }),
});

export default reducer;
