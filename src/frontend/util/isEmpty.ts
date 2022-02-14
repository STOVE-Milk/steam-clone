// [refer]: null,빈 것 체크 하는 로직 참고 https://sanghaklee.tistory.com/3
export const isEmpty = (value: any) => {
  if (
    value == '' ||
    value == null ||
    value == undefined ||
    (value != null && typeof value == 'object' && !Object.keys(value).length)
  ) {
    return true;
  } else {
    return false;
  }
};
