import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled, { css } from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faUser, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';

import Text from 'components/atoms/Text';
import FriendBox from 'components/molecules/FriendBox';
import Profile from 'components/atoms/Profile';

const Wrapper = styled.div`
  display: flex;
  padding: 3rem;
  flex-direction: column;
  height: 100%;
`;

const TitleSection = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 2rem 0;
  height: fit-content;
`;

const FriendSection = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: scroll;
`;

const FriendItem = styled.div`
  display: flex;
  width: 100%;
  background: ${(props) => props.theme.colors.secondaryBg};
  margin: 0.5rem 0;
  border-radius: 10px; ;
`;

const FriendActionBox = styled.div`
  width: fit-content;
  padding: 0 1rem;
  display: flex;
  align-items: center;
`;

const FriendActionBtn = styled(FontAwesomeIcon)`
  margin: 0 1rem;
  cursor: pointer;
`;

const Title = styled.div<{ focus: boolean }>`
  padding: 1rem;
  border-radius: 10px;
  cursor: pointer;

  ${(props) =>
    props.focus
      ? css`
          background: ${props.theme.colors.activeBg};
        `
      : null}
  :hover {
    background: ${(props) => props.theme.colors.activeBg};
  }
`;

const Friend: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  const [tab, setTab] = useState(0);

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

  useEffect(() => {});

  return (
    <Wrapper>
      <Text types={'title'}>친구 관리</Text>
      <TitleSection>
        <Title onClick={() => setTab(0)} focus={tab === 0}>
          <Text types="large">친구 목록</Text>
        </Title>
        <Title onClick={() => setTab(1)} focus={tab === 1}>
          <Text types="large">친구 추가</Text>
        </Title>
        <Title onClick={() => setTab(2)} focus={tab === 2}>
          <Text types="large">내가 신청한 친구 목록</Text>
        </Title>
        <Title onClick={() => setTab(3)} focus={tab === 3}>
          <Text types="large">내가 신청 받은 친구 목록</Text>
        </Title>
      </TitleSection>
      <FriendSection>
        {tab === 0 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox
                  open={true}
                  icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />}
                  name={friend.nickname}
                />
                <FriendActionBox>
                  <FriendActionBtn icon={faTimes} inverse />
                </FriendActionBox>
              </FriendItem>
            );
          })
        ) : tab === 1 ? (
          <div>친구검색</div>
        ) : tab === 2 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox
                  open={true}
                  icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />}
                  name={friend.nickname}
                />
                <FriendActionBox>
                  <FriendActionBtn icon={faTimes} inverse />
                </FriendActionBox>
              </FriendItem>
            );
          })
        ) : tab === 3 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox
                  open={true}
                  icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />} />}
                  name={friend.nickname}
                />
                <FriendActionBox>
                  <FriendActionBtn icon={faCheck} inverse />
                  <FriendActionBtn icon={faTimes} inverse />
                </FriendActionBox>
              </FriendItem>
            );
          })
        ) : null}
      </FriendSection>
    </Wrapper>
  );
};

export default Friend;
