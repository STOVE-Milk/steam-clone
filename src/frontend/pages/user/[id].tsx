import React, { useEffect } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import { getProfileAPI, getWithFriendAPI } from '../api/user/api';

import Text from 'components/atoms/Text';
import UserInfo from 'components/organisms/UserInfo';
import FriendBox from 'components/molecules/FriendBox';
import Profile from 'components/atoms/Profile';

const Wrapper = styled.div`
  padding: 3rem;
`;

const FriendSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 3rem;
`;

const FriendList = styled.div`
  padding-top: 1rem;
`;

const MyPage: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();
  const friends = [
    {
      id: 2,
      nickname: 'user2',
      profile: {
        image: '',
      },
    },
    {
      id: 3,
      nickname: 'user3',
      profile: {
        image: '',
      },
    },
    {
      id: 4,
      nickname: 'user4',
      profile: {
        image: '',
      },
    },
  ];

  useEffect(() => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    // getProfileAPI({ id: 1 });
    // getWithFriendAPI({ id: 1 });
  });

  return (
    <Wrapper>
      <Text types={'title'}>마이페이지</Text>
      <UserInfo
        id={1}
        nickname={'user1'}
        isFriend={false}
        profile={{
          description: 'desc',
          image: '',
        }}
      ></UserInfo>
      <FriendSection>
        <Text types={'large'}>함께 아는 친구</Text>
        <FriendList>
          {friends.map((friend) => {
            return (
              <FriendBox
                icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />}></Profile>}
                name={friend.nickname}
                open={true}
              ></FriendBox>
            );
          })}
        </FriendList>
      </FriendSection>
    </Wrapper>
  );
};

export default MyPage;
