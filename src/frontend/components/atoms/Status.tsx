import React from 'react';
import styled from 'styled-components';

export interface IUserStatusProps {
  status?: boolean;
}

export default function UserStatus(props: IUserStatusProps) {
  return <DotStyle {...props} />;
}

const DotStyle = styled.div<IUserStatusProps>`
  width: 10px;
  height: 10px;
  border-radius: 30px;
  background: ${(props) => (props.status === false ? props.theme.colors.offline : props.theme.colors.online)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
