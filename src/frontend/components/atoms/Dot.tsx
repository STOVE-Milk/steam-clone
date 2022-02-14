import React from 'react';
import styled from 'styled-components';

export interface IDotProps {
  color: string;
}

export default function Profile(props: IDotProps) {
  return <DotStyle {...props} />;
}

const DotStyle = styled.div<IDotProps>`
  width: 7px;
  height: 7px;
  border-radius: 30px;
  background: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;
