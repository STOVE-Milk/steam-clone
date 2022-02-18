import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { gameState } from './types';
import {
  GET_USERDATA,
  GET_USERDATA_SUCCESS,
  GET_USERDATA_FAIL,
  ADD_GAMEOFFSET,
  ADD_GAMEOFFSET_SUCCESS,
  ADD_GAMEOFFSET_FAIL,
  ADD_GAMEINFOBYUSER,
  ADD_GAMEINFOBYUSER_SUCCESS,
  ADD_GAMEINFOBYUSER_FAIL,
} from './actions';
import { initialUserData, initialGameOffset, initialGameInfoByUser } from './initalData';

const initialState: gameState = {
  userData: asyncState.initial(initialUserData),
  gameOffsetData: asyncState.initial(initialGameOffset),
  gameInfoByUser: asyncState.initial(initialGameInfoByUser),
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
  [ADD_GAMEOFFSET]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.load(initialGameOffset),
  }),
  [ADD_GAMEOFFSET_SUCCESS]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.success(action.payload.data),
  }),
  [ADD_GAMEOFFSET_FAIL]: (state, action) => ({
    ...state,
    gameOffsetData: asyncState.error(initialGameOffset, action.payload),
  }),

  [ADD_GAMEINFOBYUSER_SUCCESS]: (state, action) => ({
    ...state,
    gameInfoByUser: asyncState.success(action.payload.data.game_list),
  }),
  [ADD_GAMEINFOBYUSER_FAIL]: (state, action) => ({
    ...state,
    gameInfoByUser: asyncState.error(initialGameInfoByUser, action.payload),
  }),
});

export default reducer;
