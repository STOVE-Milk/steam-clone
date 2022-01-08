import React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  types: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  disabled?: boolean;
}

const ButtonStyle = styled.button<ButtonProps>`
  background: ${(props) => props.theme.colors['plain']};
  color: ${(props) => props.theme.colors[props.types + 'Bg']};
  font-size: 1rem;
  cursor: pointer;
  margin: 0 1em;
  padding: 0.25em 1em;
  border: 1px solid ${(props) => props.theme.colors[props.types + 'Bg']};
  border-radius: 10px;
  height: 50px;
  /* width: fit-content; */
  /* white-space: nowrap; */

  &:hover {
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  }
`;

export default function DefaultButton(props: ButtonProps) {
  return (
    <ButtonStyle {...props} onClick={props.onClick}>
      {props.children}
    </ButtonStyle>
  );
}

DefaultButton.defaultProps = {
  onClick: () => console.log('clicked'),
};
