import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NextPage } from 'next';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { IState } from 'modules';
import * as AuthAPI from 'api/auth/api';
import { countryOption, languageOption, validateEmail, validatePassWord } from 'util/validateSignupForm';

import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import AuthInput from 'components/molecules/AuthInput';
import AuthSelectBox from 'components/molecules/AuthSelectBox';

const signup: NextPage<IState> = () => {
  const { signup } = useSelector((state: IState) => state.auth);

  const [inputs, setInputs] = useState({
    email: '',
    password: '',
    username: '',
    nickname: '',
    language: 'KR',
    country: 'KR',
  });

  // [refer]: Record타입으로 errors의 타입을 지정(이전 프로젝트의 팀원의 코드를 이해하여 참고)
  const [errors, setErrors] = useState({} as Record<string, string>);
  const [dupChecks, setDupChecks] = useState({
    email: false,
    nickname: false,
  });
  const [signupResult, setSignupResult] = useState({} as { code: number; message: string; data: any });
  const dispatch = useDispatch();
  const router = useRouter();

  useEffect(() => {
    setErrors((prev) => ({
      ...prev,
    }));
  }, []);

  const duplicateCheck = async (type: string) => {
    switch (type) {
      case 'email': {
        if (inputs.email.length === 0) {
          alert('중복체크 전, 이메일을 입력해주세요.');
        } else if (Object.keys(errors).includes('email')) {
          alert(Object.values(errors.email).toString().replaceAll(',', ''));
        } else {
          const res = await AuthAPI.checkEmailAPI({ email: inputs.email });
          alert(res.message);

          if (res.code === 10000) {
            setErrors((prev) => {
              const state = prev;
              delete state.email;
              return { ...state };
            });
            dupChecks.email = true;
          } else {
            setErrors((prev) => ({ ...prev, email: res.message }));
          }
        }
        return;
      }
      case 'nickname': {
        if (inputs.nickname.length === 0) {
          alert(Object.values(errors));
        } else {
          const res = await AuthAPI.checkNicknameAPI({ nickname: inputs.nickname });
          alert(res.message);

          if (res.code === 10000) {
            setErrors((prev) => {
              const state = prev;
              delete state.nickname;
              return { ...state };
            });
            dupChecks.nickname = true;
          } else {
            setErrors((prev) => ({ ...prev, nickname: res.message }));
          }
        }
        return;
      }
    }
  };

  const checkEmail = (email: string) => {
    // [explain]: errors는 Record<string, string>타입을 가진 객체이고, 이 안에는 여러가지 에러에 관련된 key(email, password 등)와 에러메시지에 관련된 string이 담겨있습니다.
    // 지금까지 있던 에러에 새 에러를 업데이트 하기위해서 ...prev, 새 key:value를 넣었습니다.
    if (email.length === 0) {
      setErrors((prev) => ({ ...prev, email: '이메일을 필수로 입력후, 중복확인을 진행해주세요' }));
    } else if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: '유효하지 않은 이메일입니다.' }));
    } else {
      setErrors((prev) => {
        // [explain]: 에러가 없다면 그에 해당하는 key value를 삭제합니다.
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
    //[explain]: 객체 key, value를 할당할 떄 사용하는 javascript ES6+의 computed property names 문법입니다. 문서 참고
    setInputs({ ...inputs, [name]: value });
    if (name === 'email') checkEmail(inputs.email);
    else if (name === 'password') checkPassword(inputs.password);
  };

  const doSignUp = async () => {
    const res = await AuthAPI.doSignupAPI({ ...inputs });
    const data = await res.data;
    console.log(data);
    setSignupResult(data);
  };

  const checkAllnSubmit = () => {
    // TO DO: alert비동기처리
    //[explain]: 회원가입을 위한 모든 input이 채워졌을 때 true
    let nullChecker = true;
    Object.values(inputs).forEach((each) => {
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
    }
    console.log(Object.values(dupChecks));
    if (Object.values(dupChecks).includes(false)) {
      setErrors((prev) => ({
        ...prev,
        dupChecks: '이메일과 닉네임 중복체크를 진행해주세요.',
      }));
      // alert(Object.values(errors));
    } else {
      setErrors((prev) => {
        const state = prev;
        delete errors.dupChecks;
        return { ...state };
      });
    }

    //[explain]: 에러 객체가 비어있고, 모든 input이 채워져있을 때 signup요청을 보냅니다.
    if (Object.keys(errors).length === 0 && nullChecker) {
      doSignUp();
      // if (signupResult.code === 10000) {
      alert('가입에 성공했습니다. 로그인페이지로 이동합니다.');
      router.push('/signin');
      // }
      //TODO(지호, BE에러): 에러처리
      // else {
      //   alert(signupResult.message);
      // }
    }
  };
  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      checkAllnSubmit();
    }
  };

  return (
    <SignUpFormWrapper>
      {/* {console.log(errors)} */}
      <Text types="large">회원가입</Text>
      <AuthInput
        title="EMAIL"
        type="email"
        placeholder="EMAIL"
        name="email"
        checkValidation={() => duplicateCheck('email')}
        onChange={onChangeSetInfo}
        warningMsg={errors.email}
        onKeyPress={onKeyPress}
      />
      <AuthInput
        title="PASSWORD"
        type="password"
        placeholder="PASSWORD"
        name="password"
        onChange={onChangeSetInfo}
        warningMsg={errors.password}
        onKeyPress={onKeyPress}
      />
      <AuthInput
        title="USER NAME"
        type="text"
        placeholder="USER NAME"
        name="username"
        onChange={onChangeSetInfo}
        onKeyPress={onKeyPress}
      />
      <AuthInput
        title="NICK NAME"
        type="text"
        placeholder="NICK NAME"
        checkValidation={() => duplicateCheck('nickname')}
        name="nickname"
        onChange={onChangeSetInfo}
        onKeyPress={onKeyPress}
      />
      <InputAlign>
        <AuthSelectBox title="Country" option={countryOption} onChange={onChangeSetInfo} />
        <AuthSelectBox title="Language" option={languageOption} onChange={onChangeSetInfo} />
      </InputAlign>
      <SignUpButton types="active" onClick={checkAllnSubmit}>
        가입하기
      </SignUpButton>
    </SignUpFormWrapper>
  );
};

const SignUpFormWrapper = styled.div`
  width: 40rem;
  display: flex;
  flex-direction: column;
  margin: 2rem auto;
  padding: 2rem 4rem;
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
  width: 92%;
  margin: 1rem 0;
`;

export default signup;
