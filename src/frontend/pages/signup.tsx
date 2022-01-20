import React, { useState } from 'react';
import styled from 'styled-components';
import AuthInput from 'components/molecules/AuthInput';
import Text from 'components/atoms/Text';
import AuthSelectBox from 'components/molecules/AuthSelectBox';
import FilledButton from 'components/atoms/FilledButton';

export interface IOption {
  name: string;
  code?: string;
}

const SignUpFormWrapper = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 2rem;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
  align-items: center;
  border-radius: 10px;
  padding-top: 2rem;
`;
const InputAlign = styled.div`
  display: flex;
  width: 30rem;
  justify-content: space-between;
`;
const SignUpButton = styled(FilledButton)`
  width: 85%;
  margin-top: 1rem;
`;

const WarningMsg = styled(Text)`
  margin-top: 0.5rem;
  color: ${(props) => props.theme.colors.wish};
`;
const countryOption: IOption[] = [
  { name: 'KOREA', code: 'kr' },
  { name: 'CHINA', code: 'cn' },
  { name: 'USA', code: 'us' },
];
const languageOption: IOption[] = [
  { name: 'Korean', code: 'kr' },
  { name: 'Chinese', code: 'cn' },
  { name: 'English', code: 'us' },
];

const validateEmail = (email: string): boolean => {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);
};
const validatePassWord = (password: string): boolean => {
  // 비밀번호 규칙 정규식
  // : 숫자, 특문 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력
  return /(?=.*\d{1,50})(?=.*[~`!@#$%\^&*()-+=]{1,50})(?=.*[a-zA-Z]{2,50}).{8,50}$/.test(password);
};

const signup = () => {
  const [errors, setErrors] = useState({} as Record<any, string>);
  const [overallWarning, setOverallWarning] = useState(['']);

  const checkEmail = (email: string) => {
    if (email.length === 0) {
      setErrors((prev) => ({ ...prev, email: '이메일을 필수로 입력해주세요' }));
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: '유효하지 않은 이메일입니다.' }));
    } else {
      setErrors((prev) => {
        const state = prev;
        delete state.email;
        return { ...state };
      });
    }
  };

  const checkPassword = (pw: string) => {
    if (!validatePassWord(pw)) {
      setErrors((prev) => ({
        ...prev,
        password: '비밀번호는 숫자, 특수문자 각 1회 이상, 영문은 2개 이상 사용하여 8자리 이상 입력해주세요',
      }));
    } else
      setErrors((prev) => {
        const state = prev;
        delete errors.password;
        return { ...state };
      });
  };
  //TO DO(양하): 비어있는 영역이 있는지 체크하기, 중복체크했는지 체크하기, validation 결과는 어떻게 주지=> store에 주자?
  const checkAll = () => {
    //arguments: 비밀번호. 유저 이름, 닉네임, 국가. 언어
  };

  return (
    <SignUpFormWrapper>
      <Text types="large">회원가입</Text>
      <AuthInput
        title="EMAIL"
        type="email"
        placeholder="EMAIL"
        onChange={(e: any) => {
          checkEmail(e.target.value);
        }}
        checkValidation={true}
        warningMsg={errors.email}
      />
      <AuthInput
        title="PASSWORD"
        type="password"
        placeholder="PASSWORD"
        onChange={(e: any) => {
          checkPassword(e.target.value);
        }}
        warningMsg={errors.password}
      />
      <AuthInput title="USER NAME" type="text" placeholder="USER NAME" />
      <AuthInput title="NICK NAME" type="text" placeholder="NICK NAME" checkValidation={true} />
      <InputAlign>
        <AuthSelectBox title="Country" option={countryOption} />
        <AuthSelectBox title="Language" option={languageOption} />
      </InputAlign>
      {/* {overallWarning.length > 1 && (
        <WarningMsg>
          {overallWarning.map((eachError) => {
            return eachError;
          }) + '를 입력해주세요.'}
        </WarningMsg>
      )} */}
      <SignUpButton types="active" onClick={() => checkAll()}>
        가입하기
      </SignUpButton>
    </SignUpFormWrapper>
  );
};

export default signup;
