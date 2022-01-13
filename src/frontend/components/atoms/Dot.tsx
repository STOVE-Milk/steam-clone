import React from 'react';
import styled from 'styled-components';

export interface DotProps {
  color: string;
}

const DotStyle = styled.div<DotProps>`
  width: 7px;
  height: 7px;
  border-radius: 30px;
  background: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Profile(props: DotProps) {
  return <DotStyle {...props} />;
}
