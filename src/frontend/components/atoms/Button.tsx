import React, { Children } from 'react';
import styled, { css } from 'styled-components';
import Link from 'next/link';

export interface ButtonProps {
  color: string;
  primary?: boolean;
  onClick?: React.MouseEventHandler;
  disabled?: boolean;
  children?: React.ReactNode;
}

const ButtonStyle = styled.button<ButtonProps>`
  background: ${(props) => (props.primary ? props.color : '#FFFFFF')};
  color: ${(props) => (props.primary ? '#FFFFFF' : props.color)};
  font-size: 1em;
  cursor: pointer;
  margin: 1em;
  padding: 0.25em 1em;
  border: 1px solid ${(props) => props.color};
  border-radius: 3px;

  &:hover {
    // background: ${(props) => (props.primary ? props.color + '99' : '#FFFFFF')};
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  }
`;

function Button(props: ButtonProps) {
  return (
    <>
      <ButtonStyle {...props} onClick={props.onClick}>
        {props.children}
      </ButtonStyle>
    </>
  );
}

Button.defaultProps = {
  onClick: () => console.log('clicked'),
};

export default Button;
