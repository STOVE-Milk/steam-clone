import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';

import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import AuthInput from 'components/molecules/AuthInput';
import Text from 'components/atoms/Text';
import AuthSelectBox from 'components/molecules/AuthSelectBox';
import FilledButton from 'components/atoms/FilledButton';
import { countryOption, languageOption, validateEmail, validatePassWord } from 'util/validateSignupForm';

import { IState } from 'modules';
import { doSignup } from 'modules/user';

import { axiosClient } from 'pages/api/axiosClient';
import { IDoSignupReqType, IResType } from 'pages/api/user/type';
import { checkEmailAPI } from 'pages/api/user/api';

const SignUpFormWrapper = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  padding: 2rem;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
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
interface IInputType {
  email: string;
  password: string;
  username: string;
  nickname: string;
  language: string;
  country: string;
}

const signup: NextPage<IState> = () => {
  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    username: '',
    nickname: '',
    language: 'korean',
    country: 'korea',
  });

  const [errors, setErrors] = useState({} as Record<any, string>);
  const [overallWarning, setOverallWarning] = useState(['']);

  const { doSignup } = useSelector((state: IState) => {
    console.log(state.user);
    return state.user;
  });
  const tmpCheck = async (type: string) => {
    switch (type) {
      case 'email': {
        const res = await checkEmailAPI({ email: inputs.email });
        alert(res.message);
      }
      case 'nickname': {
        alert('nickname zone');
      }
    }
  };

  // useEffect(() => {
  //   checkEmailAPI
  // },[])

  // const dispatch = useDispatch();

  // useEffect(() => {
  // const doSignUp = (inputs: any) => {
  //   dispatch(
  //     doSignup.request({
  //       ...inputs,
  //     }),
  //   );
  //   console.log(doSignup);
  // };

  // }, [doSignup.data]);

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
  const onChangeSetInfo = (e: any) => {
    const { value, name } = e.target;
    setInputs({ ...inputs, [name]: value }); //name 의 key를 가진 값을 value 로 설정
    if (name === 'email') checkEmail(inputs.email);
    if (name === 'password') checkPassword(inputs.password);
  };

  //TO DO(양하): 비어있는 영역이 있는지 체크하기, 중복체크했는지 체크하기, validation 결과는 어떻게 주지=> store에 주자?
  const checkAll = () => {
    console.log(inputs);
    // doSignUp(inputs);
    //arguments: 비밀번호. 유저 이름, 닉네임, 국가. 언어
  };

  return (
    <SignUpFormWrapper>
      <Text types="large">회원가입</Text>
      <AuthInput
        title="EMAIL"
        type="email"
        placeholder="EMAIL"
        name="email"
        checkValidation={() => tmpCheck('email')}
        warningMsg={errors.email}
        onChange={(e: any) => onChangeSetInfo(e)}
      />
      <AuthInput
        title="PASSWORD"
        type="password"
        placeholder="PASSWORD"
        name="password"
        onChange={onChangeSetInfo}
        warningMsg={errors.password}
      />
      <AuthInput title="USER NAME" type="text" placeholder="USER NAME" name="username" onChange={onChangeSetInfo} />
      <AuthInput
        title="NICK NAME"
        type="text"
        placeholder="NICK NAME"
        checkValidation={() => tmpCheck('nickname')}
        name="nickname"
        onChange={onChangeSetInfo}
      />
      <InputAlign>
        <AuthSelectBox title="Country" option={countryOption} onChange={onChangeSetInfo} />
        <AuthSelectBox title="Language" option={languageOption} onChange={onChangeSetInfo} />
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
