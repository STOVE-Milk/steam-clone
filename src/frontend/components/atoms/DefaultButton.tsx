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

  font-size: 1em;
  cursor: pointer;
  margin: 1em;
  padding: 0.25em 1em;
  border: 1px solid ${(props) => props.theme.colors[props.types + 'Bg']};
  border-radius: 3px;
  
  &:hover {
    box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
  }
`;

function DefaultButton(props: ButtonProps) {
  return (
    <ButtonStyle {...props} onClick={props.onClick}>
      {props.children}
    </ButtonStyle>
  );
}

DefaultButton.defaultProps = {
  onClick: () => console.log('clicked'),
};

export default DefaultButton;
