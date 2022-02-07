import Reac, { useState } from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import AuthInput from 'components/molecules/AuthInput';
import { doSignInAPI } from 'pages/api/user/api';

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
    //[explain]: 회원가입을 위한 모든 input이 채워졌을 때 true
    let nullChecker = true;
    Object.values(signInInfo).forEach((each) => {
      console.log(each, each.length);
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

      const res = await doSignInAPI(signInInfo);
      alert(res.message);
      if (res.code === 10000) {
        //성공
        localStorage.setItem('accessToken', res.data.accessToken);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        // window.location.href = '/';\
        //[refer]: jwt decode하는 코드 | 출처: https://archijude.tistory.com/432
        const token = res.data.accessToken;
        const base64Payload = token.split('.')[1]; //value 0 -> header, 1 -> payload, 2 -> VERIFY SIGNATURE
        const payload = Buffer.from(base64Payload, 'base64');
        const result = JSON.parse(payload.toString());
        console.log(result);
      }
    }
  };
  const onChangeSetInfo = (e: any) => {
    const { value, name } = e.target;
    //[explain]: 객체 key, value를 할당할 떄 사용하는 javascript ES6+의 computed property names 문법입니다. 문서 참고
    setSignInInfo({ ...signInInfo, [name]: value });
  };

  return (
    <SignInFormWrapper>
      {console.log(errors)}
      <Text types="large">로그인</Text>
      <AuthInput title="EMAIL" name="email" type="email" placeholder="EMAIL" onChange={onChangeSetInfo} />
      <AuthInput title="PASSWORD" name="password" type="password" placeholder="PASSWORD" onChange={onChangeSetInfo} />
      <SignInButton types="active" onClick={() => doSignIn()}>
        로그인
      </SignInButton>
    </SignInFormWrapper>
  );
};

export default signin;
