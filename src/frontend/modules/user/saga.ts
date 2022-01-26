import { takeLatest } from 'redux-saga/effects';

import createAsyncSaga from 'modules/utils/sagaUtils';

import { getGiftCardListAPI } from 'pages/api/user/api';
import { getGiftCardList, GET_GIFTCARDLIST } from 'modules/user/actions';

const getCategoriesSaga = createAsyncSaga(getGiftCardList, getGiftCardListAPI);

export function* userSaga() {
  yield takeLatest(GET_GIFTCARDLIST, getCategoriesSaga);
}

export { userSaga as default };
