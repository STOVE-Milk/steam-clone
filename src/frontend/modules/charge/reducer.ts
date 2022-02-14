import { createReducer } from 'typesafe-actions';

import { asyncState } from 'modules/utils/reducerUtils';
import { IChargeState } from './types';
import {
  DO_CHARGE,
  DO_CHARGE_SUCCESS,
  DO_CHARGE_FAIL,
  DO_APPROVAL_CHARGE,
  DO_APPROVAL_CHARGE_SUCCESS,
  DO_APPROVAL_CHARGE_FAIL,
} from './actions';
import { initialGiftCard, initialChargeInfo, initialApprovalCharge } from './initalData';

const initialState: IChargeState = {
  charge: asyncState.initial(initialChargeInfo),
  approvalCharge: asyncState.initial(initialApprovalCharge),
};

const reducer = createReducer<IChargeState>(initialState, {
  [DO_CHARGE]: (state, action) => ({
    ...state,
    charge: asyncState.load(action.payload),
  }),
  [DO_CHARGE_SUCCESS]: (state, action) => ({
    ...state,
    charge: asyncState.success(action.payload.data),
  }),
  [DO_CHARGE_FAIL]: (state, action) => ({
    ...state,
    charge: asyncState.error(initialChargeInfo, action.payload),
  }),
  [DO_APPROVAL_CHARGE]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.load(action.payload),
  }),
  [DO_APPROVAL_CHARGE_SUCCESS]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.success(action.payload.data),
  }),
  [DO_APPROVAL_CHARGE_FAIL]: (state, action) => ({
    ...state,
    approvalCharge: asyncState.error(initialApprovalCharge, action.payload),
  }),
});

export default reducer;
