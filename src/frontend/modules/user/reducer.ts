import { createReducer } from 'typesafe-actions';
import { asyncState } from 'modules/utils/reducerUtils';
import { IUserState } from './types';
import { DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL } from './actions';

const initialState: IUserState = {
  signupResult: asyncState.initial(null),
};

const reducer = createReducer<IUserState>(initialState, {
  [DO_SIGNUP_SUCCESS]: (state, action) => ({
    ...state,
    signupResult: action.payload,
  }),
  [DO_SIGNUP_FAIL]: (state, action) => ({
    ...state,
    signupResult: action.payload,
  }),
});

export default reducer;
