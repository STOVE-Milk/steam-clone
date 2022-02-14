// 각 액션 타입을 받아 request, success, failure 액션으로 리턴
export const createRequestActionTypes = (type: string) => {
  const SUCCESS = `${type}_SUCCESS`;
  const FAILURE = `${type}_FAILURE`;
  return [type, SUCCESS, FAILURE];
};
