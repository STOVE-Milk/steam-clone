import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

export interface ProfileProps {
  userImage: string;
}

const ProfileStyle = styled(Image)`
  width: 30px;
  height: 30px;
  border-radius: 30px;
`;

export default function Profile(props: ProfileProps) {
  return <ProfileStyle src={props.userImage}></ProfileStyle>;
}
