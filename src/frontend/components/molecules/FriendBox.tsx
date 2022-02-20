import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import styled, { css } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { IFriendInfo } from 'modules/user';
import { getGameInfoByUser } from 'modules/game';

import { theme } from 'styles/theme';
import Text, { TextStyle } from 'components/atoms/Text';
import Status from 'components/atoms/Status';
import Profile from 'components/atoms/Profile';
import { DropDownText, DropDownUl, DropDownli } from 'components/atoms/Profile';

export interface IFriendBoxProps {
  friendInfo: IFriendInfo;
  open: boolean; //아이콘만 보이는지(false), 이름과 온라인 상태까지 보이는지 (true)
  selected?: boolean; //채팅방 생성 시 친구가 선택되었는지
  onClick?: (id: number) => void; //채팅방 생성 시 친구 선택
  online: boolean;
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
  const dispatch = useDispatch();

  return (
    <div>
      <FriendBoxWrapper
        onClick={() => {
          props.onClick && props.onClick(props.friendInfo.id);
          setIsActive(!isActive);
        }}
      >
        {props.friendInfo.profile.image === '' ? (
          <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        ) : (
          '실제 이미지'
        )}
        {props.open ? <FriendName types={'small'}>{props.friendInfo.nickname}</FriendName> : null}
        {props.open ? <FriendStatus status={props.online} /> : null}
      </FriendBoxWrapper>
      {props.types === 'navbar' && (
        <FriednDropDownNav ref={dropdownRef} active={`${isActive ? 'active' : 'inactive'}`}>
          <DropDownUl>
            <DropDownli
              onClick={() => {
                dispatch(getGameInfoByUser.request({ user_id: props.friendInfo.id.toString() }));
                router.push(`/library/${props.friendInfo.id}`);
              }}
            >
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

const FriendBoxWrapper = styled.div<{ selected?: boolean }>`
  display: flex;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  cursor: pointer;
  padding-left: 10px;
  width: 100%;
  ${(props) =>
    props.selected &&
    css`
      background: ${props.theme.colors.activeBg};
    `}

  :hover {
    background: ${(props) => props.theme.colors.activeBg};
  }

  :hover ${TextStyle} {
    color: ${(props) => props.theme.colors.primaryText};
  }
`;

const FriendName = styled(Text)`
  margin-left: 20px;
  margin-top: 5px;
`;

const FriendStatus = styled(Status)`
  margin-left: 20px;
  margin-right: 30px;
`;
