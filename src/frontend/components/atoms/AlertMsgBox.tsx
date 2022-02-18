import React from 'react';
import styled from 'styled-components';

export interface AlertMsgBoxProps {
  children: React.ReactNode; //메세지 내용
}

export default function AlertMsgBox(props: AlertMsgBoxProps) {
  return <Wrapper>{props.children}</Wrapper>;
}

const Wrapper = styled.div`
  width: 80%;
  border-radius: 10px;
  background: ${(props) => props.theme.colors.secondaryBg};
  color: ${(props) => props.theme.colors.primaryText};
  margin: 1rem auto;
  padding: 1rem;
  text-align: center;
`;
