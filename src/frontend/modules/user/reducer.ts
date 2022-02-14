import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { initalUserInfo } from 'modules/user/initalData';
import { IUserState } from './types';
import { SAVE_USERINFO, SAVE_USERINFO_SUCCESS, SAVE_USERINFO_FAIL } from './actions';

const initialState: IUserState = {
  userInfo: asyncState.initial(initalUserInfo),
};

const reducer = createReducer<IUserState>(initialState, {
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
