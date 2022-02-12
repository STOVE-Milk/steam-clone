import React from 'react';
import Image from 'next/image';
import styled, { css } from 'styled-components';

export interface IProfileProps {
  userImage: JSX.Element | typeof Image;
  onClick?: () => void;
}

export default function Profile(props: IProfileProps) {
  return (
    <ProfileStyle click={props.onClick !== null ? true : false} onClick={props.onClick}>
      {props.userImage}
    </ProfileStyle>
  );
}

const ProfileStyle = styled.div<{ click: boolean }>`
  min-width: 30px;
  height: 30px;
  border-radius: 30px;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.click ? 'pointer' : '')};
`;
