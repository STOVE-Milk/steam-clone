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
import { checkEmailAPI } from 'pages/api/user/api';
import mitt from 'next/dist/shared/lib/mitt';

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
  const dispatch = useDispatch();

  const duplicateCheck = async (type: string) => {
    switch (type) {
      case 'email': {
        const res = await checkEmailAPI({ email: inputs.email });
        alert(res.message);

        if (res.code === 10000) {
          setErrors((prev) => {
            const state = prev;
            delete state.email;
            return { ...state };
          });
        } else {
          setErrors((prev) => ({ ...prev, email: res.message }));
        }
      }
      case 'nickname': {
        //TO DO(지호): 아직 nickname API가 없는듯..!
        alert('nickname zone');
      }
    }
  };

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
    setInputs({ ...inputs, [name]: value });
    if (name === 'email') checkEmail(inputs.email);
    else if (name === 'password') checkPassword(inputs.password);
  };

  const checkAllnSubmit = () => {
    let nullChecker = true; //다 채워짐
    Object.values(inputs).forEach((each) => {
      each.length == 0 && (nullChecker = false);
    });
    console.log(nullChecker);
    if (!nullChecker) {
      setErrors((prev) => ({
        ...prev,
        nullChecker: '빈칸을 채워주세요',
      }));
    } else {
      setErrors((prev) => {
        const state = prev;
        delete errors.password;
        return { ...state };
      });
    }

    if (Object.keys(errors).length === 0 && nullChecker) {
      dispatch(
        doSignup.request({
          ...inputs,
        }),
      );
    } else {
      alert(Object.values(errors));
    }
  };

  return (
    <SignUpFormWrapper>
      {console.log(errors)}
      <Text types="large">회원가입</Text>
      <AuthInput
        title="EMAIL"
        type="email"
        placeholder="EMAIL"
        name="email"
        checkValidation={() => duplicateCheck('email')}
        warningMsg={errors.email}
        onChange={onChangeSetInfo}
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
        checkValidation={() => duplicateCheck('nickname')}
        name="nickname"
        onChange={onChangeSetInfo}
      />
      <InputAlign>
        <AuthSelectBox title="Country" option={countryOption} onChange={onChangeSetInfo} />
        <AuthSelectBox title="Language" option={languageOption} onChange={onChangeSetInfo} />
      </InputAlign>
      <SignUpButton types="active" onClick={() => checkAllnSubmit()}>
        가입하기
      </SignUpButton>
    </SignUpFormWrapper>
  );
};

export default signup;
