import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { ICartState } from './types';
import {
  ADD_CARTINFO,
  ADD_CARTINFO_SUCCESS,
  ADD_CARTINFO_FAIL,
  RM_CARTINFO,
  RM_CARTINFO_SUCCESS,
  RM_CARTINFO_FAIL,
} from './actions';
import { initalCartInfo } from './initalData';

const initialState: ICartState = {
  cartInfo: asyncState.initial(initalCartInfo),
};

const reducer = createReducer<ICartState>(initialState, {
  [ADD_CARTINFO]: (state, action) => ({
    ...state,
    cartInfo: asyncState.load(initalCartInfo),
  }),
  [ADD_CARTINFO_SUCCESS]: (state, action) => ({
    ...state,
    cartInfo: asyncState.success(action.payload.data),
  }),
  [ADD_CARTINFO_FAIL]: (state, action) => ({
    ...state,
    cartInfo: asyncState.error(initalCartInfo, action.payload.data),
  }),
  [RM_CARTINFO]: (state, action) => ({
    ...state,
    cartInfo: asyncState.load(initalCartInfo),
  }),
  [RM_CARTINFO_SUCCESS]: (state, action) => ({
    ...state,
    cartInfo: asyncState.success(action.payload.data),
  }),
  [RM_CARTINFO_FAIL]: (state, action) => ({
    ...state,
    cartInfo: asyncState.error(initalCartInfo, action.payload.data),
  }),
});

export default reducer;
