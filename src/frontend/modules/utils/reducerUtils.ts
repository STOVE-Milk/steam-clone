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
  load: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: true,
    data: data,
    error: null,
  }),
  success: <T, E = any>(data: T): AsyncState<T, E> => ({
    loading: false,
    data,
    error: null,
  }),
  error: <T, E>(initialData: T, error: E): AsyncState<T, E> => ({
    loading: false,
    data: initialData,
    error: error,
  }),
};
