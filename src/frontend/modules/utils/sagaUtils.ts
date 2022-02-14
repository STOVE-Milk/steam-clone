import { call, put } from 'redux-saga/effects';
import { AsyncActionCreatorBuilder, PayloadAction } from 'typesafe-actions';

type PromiseCreatorFunction<P, T> = ((payload: P) => Promise<T>) | (() => Promise<T>);

// action이 payload를 갖고 있는지 확인한다.
function isPayloadAction<P>(action: any): action is PayloadAction<string, P> {
  return action.payload !== undefined;
}

// 참고 코드: https://react.vlpt.us/using-typescript/06-ts-redux-middleware.html
// 반복적으로 만들 사가를 생성할 유틸 함수
export default function createAsyncSaga<P1, P2, P3>(
  asyncActionCreator: AsyncActionCreatorBuilder<
    [string, [P1, undefined]],
    [string, [P2, undefined]],
    [string, [P3, undefined]]
  >,
  promiseCreator: PromiseCreatorFunction<P1, P2>,
) {
  return function* saga(action: ReturnType<typeof asyncActionCreator.request>) {
    try {
      const result: P2 = isPayloadAction<P1>(action)
        ? yield call(promiseCreator, action.payload)
        : yield call(promiseCreator);
      yield put(asyncActionCreator.success(result));
    } catch (e: any) {
      yield put(asyncActionCreator.failure(e.response));
    }
  };
}
