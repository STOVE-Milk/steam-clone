export interface IOption {
  name: string;
  code?: string;
}
export const countryOption: IOption[] = [
  { name: 'KOREA', code: 'KR' },
  { name: 'CHINA', code: 'CN' },
  { name: 'USA', code: 'US' },
];
export const languageOption: IOption[] = [
  { name: 'Korean', code: 'KR' },
  { name: 'Chinese', code: 'CN' },
  { name: 'English', code: 'EN' },
];

export const validateEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};
export const validatePassWord = (password: string): boolean => {
  // 비밀번호 규칙 정규식
  // : 숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력
  return /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/.test(password);
};
