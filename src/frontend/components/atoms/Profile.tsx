import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

export interface IProfileProps {
  userImage: JSX.Element | typeof Image;
}

export default function Profile(props: IProfileProps) {
  return <ProfileStyle>{props.userImage}</ProfileStyle>;
}

const ProfileStyle = styled.div`
  min-width: 30px;
  height: 30px;
  border-radius: 30px;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
`;
