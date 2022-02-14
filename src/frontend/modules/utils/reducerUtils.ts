//각 액션 시 스토어의 state를 업데이트할 때 사용할 객체
export type AsyncState<T, E = any> = {
  data: T;
  loading: boolean;
  error: E | null;
};

// 참고 코드: https://react.vlpt.us/using-typescript/06-ts-redux-middleware.html
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
    data: data,
    error: null,
  }),
  error: <T, E>(initialData: T, error: E): AsyncState<T, E> => ({
    loading: false,
    data: initialData,
    error: error,
  }),
};
