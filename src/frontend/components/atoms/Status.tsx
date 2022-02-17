import React from 'react';
import styled from 'styled-components';

export interface IUserStatusProps {
  status?: boolean;
}

export default function UserStatus(props: IUserStatusProps) {
  return <DotStyle {...props} />;
}

const DotStyle = styled.div<IUserStatusProps>`
  width: 7px;
  height: 7px;
  border-radius: 30px;
  background: ${(props) => (props.status ? props.theme.colors.online : props.theme.colors.offline)};
  display: flex;
  align-items: center;
  justify-content: center;
`;
