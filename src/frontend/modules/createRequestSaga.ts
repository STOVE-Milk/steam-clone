import { call, put } from 'redux-saga/effects';
// import { startLoading, finishLoading } from 'modules/loading';

// export default function createRequestSaga(type, request) {
//   const SUCCESS = `${type}_SUCCESS`;
//   const FAILURE = `${type}_FAILURE`;

//   return function* (action) {
//     yield put(startLoading(type));
//     try {
//       const response = yield call(request, action.payload);
//       yield put({
//         type: SUCCESS,
//         payload: response.data,
//         meta: response,
//       });
//     } catch (e) {
//       yield put({
//         type: FAILURE,
//         payload: e,
//         error: true,
//       });
//     }
//     yield put(finishLoading(type));
//   };
// }

export const createRequestActionTypes = (type: string) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};
