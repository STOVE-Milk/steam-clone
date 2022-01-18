import React from 'react';
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
`;
const RegisterButton = styled(FilledButton)`
  width: 85%;
  margin-top: 1rem;
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

const signup = () => {
  return (
    <SignUpFormWrapper>
      <Text types="large">회원가입</Text>
      <AuthInput title="EMAIL" type="email" placeholder="EMAIL" hasError={true} warningMsg={'warning'} />
      <AuthInput title="PASSWORD" type="password" placeholder="PASSWORD" />
      <AuthInput title="USER NAME" type="text" placeholder="USER NAME" />
      <AuthInput title="NICK NAME" type="text" placeholder="NICK NAME" hasError={true} />
      <InputAlign>
        <AuthSelectBox title="Country" option={countryOption} />
        <AuthSelectBox title="Language" option={languageOption} />
      </InputAlign>
      <RegisterButton types="active">가입하기</RegisterButton>
    </SignUpFormWrapper>
  );
};

export default signup;
