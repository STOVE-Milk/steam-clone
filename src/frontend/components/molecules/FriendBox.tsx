import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

import styled, { css } from 'styled-components';

import { IFriendInfo } from 'modules/user';

import Text, { TextStyle } from 'components/atoms/Text';
import Status from 'components/atoms/Status';
import Profile from 'components/atoms/Profile';
import { DropDownText, DropDownUl, DropDownli } from 'components/atoms/Profile';

export interface IFriendBoxProps {
  friendInfo: IFriendInfo;
  open: boolean; //아이콘만 보이는지(false), 이름과 온라인 상태까지 보이는지 (true)
  onClick?: (nickname: string, id: number) => void; //채팅방 생성 시 친구 선택
  online?: boolean;
  types: string;
}

export default function FriendBox(props: IFriendBoxProps) {
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
      <FriendBoxWrapper
        open={props.open}
        types={props.types}
        onClick={() => {
          props.onClick && props.onClick(props.friendInfo.nickname, props.friendInfo.id);
          setIsActive(!isActive);
        }}
      >
        <Profile profileImg={props.friendInfo.profile.image} />
        {props.open ? <FriendName types={'small'}>{props.friendInfo.nickname}</FriendName> : null}
        {props.open && props.online !== undefined ? <FriendStatus status={props.online} /> : null}
      </FriendBoxWrapper>
      {props.types === 'navbar' && (
        <FriednDropDownNav ref={dropdownRef} active={`${isActive ? 'active' : 'inactive'}`}>
          <DropDownUl>
            <DropDownli onClick={() => router.push(`/library/${props.friendInfo.id}`)}>
              <DropDownText>친구 라이브러리</DropDownText>
            </DropDownli>
            <DropDownli onClick={() => router.push('/chat')}>
              <DropDownText>채팅</DropDownText>
            </DropDownli>
            <DropDownli onClick={() => router.push(`/user/${props.friendInfo.id}`)}>
              <DropDownText>친구 프로필</DropDownText>
            </DropDownli>
          </DropDownUl>
        </FriednDropDownNav>
      )}
    </div>
  );
}
const FriednDropDownNav = styled.nav<{ active: string }>`
  cursor: pointer;
  background: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 8px;
  position: absolute;
  left: 5rem;
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

const FriendBoxWrapper = styled.div<{ open: boolean; types: string }>`
  display: flex;
  height: 50px;
  align-items: center;
  border-radius: 10px;
  cursor: pointer;
  padding-left: 10px;
  min-width: 150px;
  ${(props) =>
    !props.open
      ? css`
          justify-content: center;
        `
      : null}

  :hover ${TextStyle} {
    color: ${(props) => props.theme.colors.primaryText};

    ${(props) =>
      props.types === 'navbar' || props.types === 'chat'
        ? css`
            background: ${(props) => props.theme.colors.activeBg};
          `
        : null}
  }
`;

const FriendName = styled(Text)`
  margin-left: 20px;
`;

const FriendStatus = styled(Status)`
  margin-left: auto;
  margin-right: 0.5rem;
`;
