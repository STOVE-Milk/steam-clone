import React from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import AuthInput from 'components/molecules/AuthInput';

const SignInFormWrapper = styled.div`
  width: 40rem;
  margin: 0 auto;
  padding: 2rem;
  background: ${(props) => props.theme.colors.secondaryBg};
  align-items: center;
  border-radius: 10px;
  padding-top: 2rem;
  display: flex;
  flex-direction: column;
`;

const SignInButton = styled(FilledButton)`
  width: 85%;
  margin-top: 1rem;
`;

const signin = () => {
  return (
    <SignInFormWrapper>
      <Text types="large">로그인</Text>
      <AuthInput title="EMAIL" type="email" placeholder="EMAIL" />
      <AuthInput title="PASSWORD" type="password" placeholder="PASSWORD" />
      <SignInButton types="active" onClick={() => console.log('로그인 요청을 해주세요!')}>
        로그인
      </SignInButton>
    </SignInFormWrapper>
  );
};

export default signin;
