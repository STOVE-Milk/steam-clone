import { createReducer } from 'typesafe-actions';
import { asyncState } from 'modules/utils/reducerUtils';
import { IUserState } from './types';
import {
  DO_SIGNUP,
  DO_SIGNUP_SUCCESS,
  DO_SIGNUP_FAIL,
  SAVE_USERINFO,
  SAVE_USERINFO_SUCCESS,
  SAVE_USERINFO_FAIL,
} from './actions';
import { initialSingup, initalUserInfo } from 'modules/user/initalData';

const initialState: IUserState = {
  signup: asyncState.initial(initialSingup),
  userInfo: asyncState.initial(initalUserInfo),
};

const reducer = createReducer<IUserState>(initialState, {
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
    userInfo: asyncState.success(action.payload.data),
  }),
  [SAVE_USERINFO_FAIL]: (state, action) => ({
    ...state,
    userInfo: asyncState.error(initalUserInfo, action.payload.data),
  }),
});

export default reducer;
