import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { IState } from 'modules';
import { saveUserInfo } from 'modules/user';
import { doSignInAPI } from 'api/auth/api';
import { parseToken } from 'util/parseToken';
import { GET_FRIEND } from 'modules/friend';
import { getFriendsAPI } from 'api/friend/api';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import AuthInput from 'components/molecules/AuthInput';

const signin: NextPage<IState> = () => {
  //[info]: userInfo.data에 accessToken에서 온 정보들이 들어가 있습니다.
  const { userInfo } = useSelector((state: IState) => state.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [signInInfo, setSignInInfo] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({} as Record<any, string>);

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
      nullChecker: '빈칸을 채워주세요',
    }));
  }, []);

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
      alert(Object.values(errors));
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
        const result = parseToken(res.data.accessToken);
        dispatch(saveUserInfo.request(result));
        router.push('/category'); // TO DO(양하): 메인으로 redirect 변경, 지금 메인페이지 오류나서 일단 카테고리 페이지로 redirect

        //친구 목록 불러와서 API에 저장
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
      <Text types="large">로그인</Text>
      <AuthInput title="EMAIL" name="email" type="email" placeholder="EMAIL" onChange={onChangeSetInfo} />
      <AuthInput title="PASSWORD" name="password" type="password" placeholder="PASSWORD" onChange={onChangeSetInfo} />
      <SignInButton types="active" onClick={() => doSignIn()}>
        로그인
      </SignInButton>
    </SignInFormWrapper>
  );
};

const SignInFormWrapper = styled.div`
  width: 40rem;
  margin: 2rem auto;
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

export default signin;
