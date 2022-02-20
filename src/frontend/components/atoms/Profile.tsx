import React, { useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import Image from 'next/image';
import styled from 'styled-components';

import Text from 'components/atoms/Text';

export interface IProfileProps {
  userImage: JSX.Element | typeof Image;
  onClick?: () => void;
}

export default function Profile(props: IProfileProps) {
  const dropdownRef = useRef<any>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const pageClickEvent = (e: any) => {
      if (dropdownRef.current !== null && !dropdownRef.current.contains(e.target)) {
        setIsActive(!isActive);
      }
    };

    if (isActive) {
      window.addEventListener('click', pageClickEvent);
    }

    return () => {
      window.removeEventListener('click', pageClickEvent);
    };
  }, [isActive]);
  const router = useRouter();

  return (
    <div>
      <ProfileStyle
        click={props.onClick !== null ? true : false}
        onClick={() => {
          props.onClick;
          setIsActive(!isActive);
        }}
      >
        {props.userImage}
      </ProfileStyle>
      {console.log(isActive)}
      <DropDownNav ref={dropdownRef} active={`${isActive ? 'active' : 'inactive'}`}>
        <DropDownUl>
          <DropDownli onClick={() => router.push('/signup')}>
            <DropDownText>회원가입</DropDownText>
          </DropDownli>
          <DropDownli onClick={() => router.push('/signin')}>
            <DropDownText>로그인</DropDownText>
          </DropDownli>
          <DropDownli onClick={() => router.push('/user/1')}>
            <DropDownText>마이페이지</DropDownText>
          </DropDownli>
        </DropDownUl>
      </DropDownNav>
    </div>
  );
}
export const DropDownText = styled(Text)`
  text-decoration: none;
  padding: 15px 20px;
  display: block;
`;
export const DropDownUl = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;
export const DropDownli = styled.li`
  :not(:last-child) {
    border-bottom: 1px solid ${(props) => props.theme.colors.divider};
  }
`;
export const DropDownNav = styled.nav<{ active: string }>`
  cursor: pointer;
  background: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 8px;
  position: absolute;
  top: 60px;
  right: 0;
  width: 150px;
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.3);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-20px);
  transition: opacity 0.4s ease, transform 0.4s ease, visibility -3.5s;
  ${(props) =>
    props.active === 'active' && {
      opacity: 1,
      visibility: 'visible',
      'margin-right': '57px',
      transform: 'translateY(0)',
      width: '150px',
    }}
`;

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
