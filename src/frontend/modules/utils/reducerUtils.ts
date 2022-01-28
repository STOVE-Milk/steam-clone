import { AnyAction } from 'redux';
import { AsyncActionCreatorBuilder, getType } from 'typesafe-actions';

export type AsyncState<T, E = any> = {
  data: T;
  loading: boolean;
  error: E | null;
};

export const asyncState = {
  // 다음 코드는 화살표 함수에 Generic 을 설정 한 것입니다.
  initial: <T, E = any>(initialData: T): AsyncState<T, E> => ({
    loading: false,
    data: initialData,
    error: null,
  }),
  load: <T, E = any>(initialData: T): AsyncState<T, E> => ({
    loading: true,
    data: initialData,
    error: null,
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data: data,
    error: null,
  }),
  error: <T, E>(initialData: T, error: E): AsyncState<T, E> => ({
    loading: false,
    data: initialData,
    error: error,
  }),
};

export function transformToArray<AC extends AnyAsyncActionCreator>(asyncActionCreator: AC) {
  const { request, success, failure } = asyncActionCreator;
  return [request, success, failure];
}
type AnyAsyncActionCreator = AsyncActionCreatorBuilder<any, any, any>;

export function createAsyncReducer<S, AC extends AnyAsyncActionCreator, K extends keyof S>(
  asyncActionCreator: AC,
  key: string,
) {
  return (state: S, action: AnyAction) => {
    // 각 액션 생성함수의 type 을 추출해줍니다.
    const [request, success, failure] = [
      asyncActionCreator.request,
      asyncActionCreator.success,
      asyncActionCreator.failure,
    ].map(getType);
    switch (action.type) {
      case request:
        return {
          ...state,
          [key]: asyncState.load(action.payload),
        };
      case success:
        return {
          ...state,
          [key]: asyncState.success(action.payload),
        };
      case failure:
        return {
          ...state,
          [key]: asyncState.error(action.payload),
        };
      default:
        return state;
    }
  };
}
