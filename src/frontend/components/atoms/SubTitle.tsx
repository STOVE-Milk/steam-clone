import React from 'react';
import styled from 'styled-components';

export interface SubTitleProps {
  children: React.ReactNode;
}

export const SubTitleStyle = styled.div`
  font-size: 1.2rem;
  color: ${(props) => props.theme.colors.secondaryText};
  font-weight: bold;
`;

export default function SubTitle(props: SubTitleProps) {
  return <SubTitleStyle {...props}>{props.children}</SubTitleStyle>;
}
