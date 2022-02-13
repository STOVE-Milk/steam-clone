import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { initialSingup } from 'modules/auth/initalData';
import { IAuthState } from './types';
import { DO_SIGNUP, DO_SIGNUP_SUCCESS, DO_SIGNUP_FAIL } from './actions';

const initialState: IAuthState = {
  signup: asyncState.initial(initialSingup),
};

const reducer = createReducer<IAuthState>(initialState, {
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
});

export default reducer;
