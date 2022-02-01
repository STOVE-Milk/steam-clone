import { createReducer } from 'typesafe-actions';
import { asyncState } from 'modules/utils/reducerUtils';
import { IUserState } from './types';
import { DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL } from './actions';

const initialState: IUserState = {
  signup: asyncState.initial({}),
};

const reducer = createReducer<IUserState>(initialState, {
  [DO_SIGNUP]: (state, action) => ({
    ...state,
    signup: asyncState.load(action.payload),
  }),
  [DO_SIGNUP_SUCCESS]: (state, action) => ({
    ...state,
    signup: asyncState.success(action.payload),
  }),
  [DO_SIGNUP_FAIL]: (state, action) => ({
    ...state,
    signup: asyncState.error({}, action.payload),
  }),
});

export default reducer;
