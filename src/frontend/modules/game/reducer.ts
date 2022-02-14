import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import { GET_USERDATA, GET_USERDATA_SUCCESS, GET_USERDATA_FAIL } from './actions';
import { initialUserData } from './initalData';

const initialState: gameState = {
  userData: asyncState.initial(initialUserData),
};

const reducer = createReducer<gameState>(initialState, {
  [GET_USERDATA]: (state, action) => ({
    ...state,
    userData: asyncState.load(initialUserData),
  }),
  [GET_USERDATA_SUCCESS]: (state, action) => ({
    ...state,
    userData: asyncState.success(action.payload.data),
  }),
  [GET_USERDATA_FAIL]: (state, action) => ({
    ...state,
    userData: asyncState.error(initialUserData, action.payload),
  }),
});

export default reducer;
