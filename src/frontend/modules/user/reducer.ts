import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { initalUserInfo, initalFriendInfo } from 'modules/user/initalData';
import { IUserState } from './types';
import { SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL } from './actions';
import { GET_FRIEND, GET_FRIEND_SUCCESS, GET_FRIEND_FAIL, SET_ONLINE, SET_OFFLINE, SET_WEBSOCKET } from './actions';

const initialState: IUserState = {
  userInfo: asyncState.initial(initalUserInfo),
  friends: asyncState.initial(initalFriendInfo),
  socket: asyncState.initial(undefined),
  onlines: asyncState.initial([]),
};

const reducer = createReducer<IUserState>(initialState, {
  [SAVE_USERINFO]: (state, action) => ({
    ...state,
    userInfo: asyncState.load(initalUserInfo),
  }),
  [SAVE_USERINFO_SUCCESS]: (state, action) => ({
    ...state,
    userInfo: asyncState.success(action.payload.data),
  }),
  [SAVE_USERINFO_FAIL]: (state, action) => ({
    ...state,
    userInfo: asyncState.error(initalUserInfo, action.payload.data),
  }),

  [GET_FRIEND]: (state, action) => ({
    ...state,
    friends: asyncState.load(initalFriendInfo),
  }),
  [GET_FRIEND_SUCCESS]: (state, action) => ({
    ...state,
    friends: asyncState.success(action.payload.data.friends),
  }),
  [GET_FRIEND_FAIL]: (state, action) => ({
    ...state,
    friends: asyncState.error(initalFriendInfo, action.payload),
  }),

  [SET_ONLINE]: (state, action) => ({
    ...state,
    onlines: asyncState.success(state.onlines.data.concat(action.payload)),
  }),
  [SET_OFFLINE]: (state, action) => ({
    ...state,
    onlines: asyncState.success(state.onlines.data.filter((f) => f !== action.payload)),
  }),

  [SET_WEBSOCKET]: (state, action) => ({
    ...state,
    socket: asyncState.success(action.payload),
  }),
});

export default reducer;
