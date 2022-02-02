import Reac, { useState } from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import AuthInput from 'components/molecules/AuthInput';
import { doLogInAPI } from 'pages/api/user/api';

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
  const [signInInfo, setSignInInfo] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({} as Record<any, string>);

  const doSignIn = async () => {
    let nullChecker = true; //다 채워짐
    Object.values(signInInfo).forEach((each) => {
      each.length == 0 && (nullChecker = false);
    });

    if (!nullChecker) {
      setErrors((prev) => ({
        ...prev,
        nullChecker: '빈칸을 채워주세요',
      }));
    } else {
      setErrors((prev) => {
        const state = prev;
        delete errors.nullChecker;
        return { ...state };
      });
      const res = await doLogInAPI(signInInfo);
      alert('로그인 요청');
      if (res.code === 10000) {
        //성공
        alert(res.message);
        //TO DO(양하) : accessToken: String, refreshToken: String 처리하기
        // localStorage.setItem('accessToken', res.data.accessToken)
        // localStorage.setItem('refreshToken', res.data.refreshToken)
        window.location.href = '/';
      }
    }
  };

  return (
    <SignInFormWrapper>
      {console.log(errors)}
      <Text types="large">로그인</Text>
      <AuthInput title="EMAIL" name="email" type="email" placeholder="EMAIL" />
      <AuthInput title="PASSWORD" name="password" type="password" placeholder="PASSWORD" />
      <SignInButton types="active" onClick={doSignIn}>
        로그인
      </SignInButton>
    </SignInFormWrapper>
  );
};

export default signin;
