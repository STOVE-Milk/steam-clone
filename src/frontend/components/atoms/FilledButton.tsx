import React from 'react';
import styled from 'styled-components';

export interface ButtonProps {
  types: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  disabled?: boolean;
}

const ButtonStyle = styled.button<ButtonProps>`
  background: ${(props) => props.theme.colors[props.types + 'Bg']};
  color: ${(props) => props.theme.colors['primaryText']};
  font-size: 1em;
  cursor: pointer;
  margin: 0 1em;
  padding: 0.25em 1em;
  border: 1px solid ${(props) => props.theme.colors[props.types + 'Bg']};
  border-radius: 10px;
  height: 50px;
  width: fit-content;
  white-space: nowrap;

  &:hover {
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
    background: ${(props) => props.theme.colors['activeBg']};
    border: 1px solid ${(props) => props.theme.colors['activeBg']};
  }
`;

export default function FilledButton(props: ButtonProps) {
  return (
    <ButtonStyle {...props} onClick={props.onClick}>
      {props.children}
    </ButtonStyle>
  );
}

FilledButton.defaultProps = {
  onClick: () => console.log('clicked'),
};
