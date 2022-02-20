import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled, { css } from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faCheck, faTimes, faSearch, faPlus } from '@fortawesome/free-solid-svg-icons';

import { IFriendInfo } from 'modules/user';
import * as FriendAPI from 'api/friend/api';
import { verifyToken } from 'util/verifyToken';

import Text from 'components/atoms/Text';
import { TextTheme } from 'components/atoms/Text';
import FriendBox from 'components/molecules/FriendBox';

const Friend: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  const [tab, setTab] = useState(0); //탭 number
  const [friends, setFriends] = useState([] as IFriendInfo[]); //각 탭에서 보일 친구 목록들. 친구 객체 타입이 동일하므로 같은 state 사용
  const [searchInput, setSearchInput] = useState(''); // 친구 검색 input 값

  // 화면에서 탭 전환 함수
  const changeTab = (tabNumber: number) => {
    setTab(tabNumber);

    setFriends([]);
    setSearchInput('');

    switch (tabNumber) {
      case 0:
        getFriends();
        break;
      case 2:
        sendedFriend();
      case 3:
        receivedFriend();
    }
  };

  // 친구 목록
  const getFriends = async () => {
    const res = (await FriendAPI.getFriendsAPI()).data.friends;
    setFriends(res);
  };

  // 친구 삭제
  const deleteFriend = async (id: number) => {
    await FriendAPI.deleteFriendAPI(id);
    getFriends();
  };

  // 친구 신청을  위해 유저 검색
  const searchFriend = async () => {
    const res = (await FriendAPI.searchFriendAPI(searchInput)).data.users;
    setFriends(res);
  };

  // 친구 신청
  const sendFriendRequest = async (id: number) => {
    await FriendAPI.sendFriendRequestAPI({ user_id: id });
    const res = (await FriendAPI.searchFriendAPI(searchInput)).data.users;
    setFriends(res);
  };

  // 내가 보낸 친구 신청 목록
  const sendedFriend = async () => {
    const res = (await FriendAPI.getSendedFriendAPI()).data.requests;
    setFriends(res);
  };

  // 내가 보낸 친구 신청 취소, 내가 받은 친구 신청 거절
  const deleteFriendRequest = async (id: number) => {
    await FriendAPI.deleteFriendRequestAPI(id);

    if (tab === 2) {
      sendedFriend();
    } else if (tab === 3) {
      receivedFriend();
    }
  };

  // 내가 받은 친구 신청 목록
  const receivedFriend = async () => {
    const res = (await FriendAPI.getReceivedFriendsAPI()).data.requests;
    setFriends(res);
  };

  // 친구 신청 수락
  const acceptFriend = async (id: number) => {
    await FriendAPI.acceptFriendAPI({ request_id: id });
    receivedFriend();
  };

  useEffect(() => {
    verifyToken();
    getFriends();
  }, []);

  return (
    <Wrapper>
      <Text types={'title'}>친구 관리</Text>
      <TitleSection>
        <Title onClick={() => changeTab(0)} focus={tab === 0}>
          <Text types="large">친구 목록</Text>
        </Title>
        <Title onClick={() => changeTab(1)} focus={tab === 1}>
          <Text types="large">친구 추가</Text>
        </Title>
        <Title onClick={() => changeTab(2)} focus={tab === 2}>
          <Text types="large">내가 신청한 친구 목록</Text>
        </Title>
        <Title onClick={() => changeTab(3)} focus={tab === 3}>
          <Text types="large">내가 신청 받은 친구 목록</Text>
        </Title>
      </TitleSection>
      {/* 나중에 리팩토링 하기 
        TODO: tab 부분을 삼항연산자가 아니라 함수화? 위에 부분도 map으로 만들 수 있을듯! 
        TODO: FriendList로 컴포넌트화 하기 -> 고려해야할 것: 버튼 아이콘, 버튼별 함수, 버튼 개수
      */}
      <FriendSection>
        {tab === 0 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox types={''} open={true} friendInfo={friend} />
                <FriendActionBox>
                  <FriendActionBtn onClick={() => deleteFriend(friend.id)} icon={faTimes} inverse />
                </FriendActionBox>
              </FriendItem>
            );
          })
        ) : tab === 1 ? (
          <>
            <SearchBox>
              <SearchInput
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value);
                }}
              ></SearchInput>
              <FriendActionBtn onClick={searchFriend} icon={faSearch} inverse />
            </SearchBox>
            <ResultBox>
              <Text types={'large'}>검색결과</Text>
              <FriendList>
                {friends.map((friend) => {
                  return (
                    <FriendItem key={friend.id}>
                      <FriendBox types={''} open={true} friendInfo={friend} />
                      <FriendActionBox>
                        {friend.is_friend && friend.is_friend === 1 ? (
                          <FriendActionBtn icon={faUser} inverse></FriendActionBtn>
                        ) : friend.was_requested === 1 ? (
                          <FriendActionBtn icon={faCheck} inverse></FriendActionBtn>
                        ) : (
                          <FriendActionBtn onClick={() => sendFriendRequest(friend.id)} icon={faPlus} inverse />
                        )}
                      </FriendActionBox>
                    </FriendItem>
                  );
                })}
              </FriendList>
            </ResultBox>
          </>
        ) : tab === 2 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox open={true} friendInfo={friend} />
                <FriendActionBox>
                  <FriendActionBtn onClick={() => deleteFriendRequest(friend.id)} icon={faTimes} inverse />
                </FriendActionBox>
              </FriendItem>
            );
          })
        ) : tab === 3 ? (
          friends.map((friend) => {
            return (
              <FriendItem>
                <FriendBox open={true} friendInfo={friend} />
                <FriendActionBox>
                  <FriendActionBtn onClick={() => acceptFriend(friend.id)} icon={faCheck} inverse />
                  <FriendActionBtn onClick={() => deleteFriendRequest(friend.id)} icon={faTimes} inverse />
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

  ::-webkit-scrollbar {
    display: none;
  }
`;

const FriendItem = styled.div`
  display: flex;
  width: 100%;
  background: ${(props) => props.theme.colors.secondaryBg};
  margin: 0.5rem 0;
  border-radius: 10px;
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

const SearchBox = styled.div`
  border: 1px solid white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 1rem;
`;

const SearchInput = styled.input`
  border: none;
  padding: 0.5rem;
  flex: 1;
  background: transparent;
  color: ${TextTheme.medium.color};
  font-size: ${TextTheme.medium.size};
`;

const ResultBox = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 3rem;
`;

const FriendList = styled.div`
  padding: 1rem 0;
`;
