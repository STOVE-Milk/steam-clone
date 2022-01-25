import React, { Children } from 'react';
import styled from 'styled-components';
import { promisify } from 'util';
import { css } from 'styled-components';

export interface MsgBoxProps {
  isMine: boolean;
  children: React.ReactNode;
}

const MsgBoxStyle = styled.span<MsgBoxProps>`
  display: inline-block;
  position: relative;
  background: ${(props) => (props.isMine ? props.theme.colors.primaryText : props.theme.colors.activeBg)};
  height: fit-content;
  width: fit-content;
  border-radius: 10px;
  padding: 1rem;
  margin: 1rem 0;
  align-self: ${(props) => (props.isMine ? 'flex-end' : 'flex-start')};

  :after {
    content: '';
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

export default function MsgBox(props: MsgBoxProps) {
  return <MsgBoxStyle {...props}>{props.children}</MsgBoxStyle>;
}
