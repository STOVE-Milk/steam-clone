import React from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
export interface IAuthInputProps {
  title: string;
  type: 'email' | 'password' | 'text';
  placeholder?: string;
  onChange?: React.ChangeEventHandler;
  checkValidation?: boolean;
  warningMsg?: string;
}
const InputTitleText = styled(Text)`
  margin-bottom: 0.5rem;
`;
const InputWrapper = styled.form`
  margin-top: 2rem;
  width: 85%;
`;
const InputBoxWrapper = styled.div`
  display: flex;
  align-items: center;
`;
const InputBox = styled.input`
  background: ${(props) => props.theme.colors.plain};
  border: 1px solid ${(props) => props.theme.colors.plain};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  width: 30rem;
`;
const ValidateBtnStyle = styled(FilledButton)`
  height: 100%;
  font-size: 0.8rem;
`;
const WarningMsg = styled(Text)`
  margin-top: 0.5rem;
  color: ${(props) => props.theme.colors.wish};
`;

export default function AuthInput({
  title,
  type,
  placeholder,
  onChange,
  checkValidation,
  warningMsg,
}: IAuthInputProps) {
  return (
    <InputWrapper>
      <InputTitleText>{title}</InputTitleText>
      <InputBoxWrapper>
        <InputBox type={type} placeholder={placeholder} onChange={onChange} />
        {checkValidation && <ValidateBtnStyle types="primary">중복확인</ValidateBtnStyle>}
      </InputBoxWrapper>
      <WarningMsg>{warningMsg}</WarningMsg>
    </InputWrapper>
  );
}
