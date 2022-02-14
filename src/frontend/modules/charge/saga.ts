import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';
import { doChargeAPI, doApprovalChargeAPI } from 'api/charge/api';
import { doCharge, DO_CHARGE, doApprovalCharge, DO_APPROVAL_CHARGE } from 'modules/charge/actions';

const doChargeSaga = createAsyncSaga(doCharge, doChargeAPI);
const doApprovalChargeSaga = createAsyncSaga(doApprovalCharge, doApprovalChargeAPI);

export function* chargeSaga() {
  yield takeLatest(DO_CHARGE, doChargeSaga);
  yield takeLatest(DO_APPROVAL_CHARGE, doApprovalChargeSaga);
}

export { chargeSaga as default };
