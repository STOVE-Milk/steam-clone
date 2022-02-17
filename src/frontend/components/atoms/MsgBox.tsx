import React from 'react';
import styled, { css } from 'styled-components';

export interface MsgBoxProps {
  isMine: boolean; //내가 보낸 메세지인지 여부
  name: string; //보낸 사람 이름
  children: React.ReactNode; //메세지 내용
}

export default function MsgBox(props: MsgBoxProps) {
  return (
    <Wrapper>
      <Name isMine={props.isMine}>{props.name}</Name>
      <MsgBoxStyle isMine={props.isMine}>{props.children}</MsgBoxStyle>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.7rem 0;
`;

const Name = styled.div<{ isMine: boolean }>`
  color: ${(props) => props.theme.colors.primaryText};
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};
`;

const MsgBoxStyle = styled.span<{ isMine: boolean }>`
  display: inline-block;
  position: relative;
  background: ${(props) => (props.isMine ? props.theme.colors.primaryText : props.theme.colors.activeBg)};
  height: fit-content;
  width: fit-content;
  border-radius: 10px;
  padding: 1rem;
  margin-top: 0.5rem;
  line-height: 1.3rem;
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};

  :after {
    position: absolute;
    ${(props) =>
      props.isMine
        ? css`
            border-top: 15px solid ${(props) => props.theme.colors.primaryText};
            border-right: 15px solid transparent;
            top: 10px;
            right: -10px;
          `
        : css`
            border-top: 15px solid ${(props) => props.theme.colors.activeBg};
            border-left: 15px solid transparent;
            top: 10px;
            left: -10px;
          `}
  }
`;
