import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

export interface ProfileProps {
  userImage: JSX.Element | typeof Image;
}

const ProfileStyle = styled.div`
  width: 30px;
  height: 30px;
  border-radius: 30px;
  background: ${(props) => props.theme.colors.secondaryBg};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function Profile(props: ProfileProps) {
  return <ProfileStyle>{props.userImage}</ProfileStyle>;
}
