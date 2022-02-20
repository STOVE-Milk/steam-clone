import React from 'react';
import styled from 'styled-components';

export interface IButtonProps {
  types: string;
  onClick?: React.MouseEventHandler;
  children: React.ReactNode;
  disabled?: boolean;
}

export default function FilledButton(props: IButtonProps) {
  return (
    <ButtonStyle {...props} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </ButtonStyle>
  );
}

FilledButton.defaultProps = {
  onClick: () => console.log('clicked'),
};

const ButtonStyle = styled.button<IButtonProps>`
  background: ${(props) => props.theme.colors[props.types + 'Bg']};
  color: ${(props) => props.theme.colors['primaryText']};
  font-size: 1em;
  cursor: pointer;
  margin: 0 1rem;
  padding: 0.25rem 1rem;
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
  ${(props) =>
    props.disabled && {
      // border: 1px solid props.theme.colors['secondaryBg'];
      background: props.theme.colors['primaryBg'],
      color: props.theme.colors['divider'],
    }}
`;
