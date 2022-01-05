import React from 'react';
import styled from 'styled-components';

export interface SubTitleProps {
  children: React.ReactNode;
}

const SubTitleStyle = styled.div`
  font-size: 1rem;
  color: ${(props) => props.theme.colors.secondaryText};
`;

export default function SubTitle(props: SubTitleProps) {
  return <SubTitleStyle {...props}>{props.children}</SubTitleStyle>;
}
