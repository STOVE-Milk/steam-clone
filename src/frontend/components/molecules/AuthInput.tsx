import React from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { theme } from 'styles/theme';

export interface IAuthInputProps {
  title: string;
  type: 'email' | 'password' | 'text';
  placeholder?: string;
  hasError?: boolean;
  checkValidation?: boolean;
  warningMsg?: string;
}

const InputTitleText = styled(Text)`
  margin-bottom: 0.5rem;
`;
const InputWrapper = styled.form`
  /* display: flex;
  align-items: center; */
  margin-top: 2rem;
  width: 85%;
`;

const InputBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;
const InputBox = styled.input`
  background: ${(props) => props.theme.colors.plain};
  border: 1px solid ${(props) => props.theme.colors.plain};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  width: 30rem;
  /* margin-right: 0.5rem; */
  ${(props) => props.theme.breakpoints.medium} {
    width: 20rem;
  }
`;
const WarningIcon = styled(FontAwesomeIcon)`
  /* position: absolute; */
  margin-left: 0.5rem;
`;
const WarningMsg = styled(Text)`
  margin-top: 0.5rem;
  color: ${(props) => props.theme.colors.wish};
`;

export default function AuthInput({ title, type, placeholder, hasError, warningMsg }: IAuthInputProps) {
  return (
    <InputWrapper>
      <InputTitleText>{title}</InputTitleText>
      <InputBoxWrapper>
        <InputBox type={type} placeholder={placeholder} />
        {hasError && <WarningIcon icon={faExclamationTriangle} inverse />}
      </InputBoxWrapper>
      {hasError && <WarningMsg>{warningMsg}</WarningMsg>}
    </InputWrapper>
  );
}
