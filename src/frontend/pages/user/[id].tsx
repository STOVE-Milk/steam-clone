import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestion, faUser } from '@fortawesome/free-solid-svg-icons';

import { IState } from 'modules';
import {
  getProfileAPI,
  getWithFriendAPI,
  getGuestBooksAPI,
  addGuestBookAPI,
  modifyGuestBookAPI,
} from '../api/user/api';

import Text from 'components/atoms/Text';
import UserInfo from 'components/organisms/UserInfo';
import FriendBox from 'components/molecules/FriendBox';
import Profile from 'components/atoms/Profile';
import GuestBook from 'components/organisms/GuestBook';

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

const GuestBookSection = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 3rem;
`;

const GuestBookList = styled.div`
  padding-top: 1rem;
`;

const MyPage: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  const [guestBooks, setGuestBooks] = useState<IResReview[]>([
    {
      id: 1,
      guest_id: 2,
      profile: {},
      displayName: 'user2',
      content: 'hi',
      created_at: 'time1',
    },
    {
      id: 2,
      guest_id: 3,
      profile: {},
      displayName: 'user3',
      content: 'hihi',
      created_at: 'time2',
    },
    {
      id: 3,
      guest_id: 4,
      profile: {},
      displayName: 'user4',
      content: 'hihihi',
      created_at: 'time3',
    },
  ]);

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

  const getGuestBooks = async (id: number) => {
    const res = (await getGuestBooksAPI({ id: id })).payload.data.guest_book;
    console.log(res);
    setGuestBooks(res);
  };

  const [userGuestBook, setUserGuestBook] = useState('');
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserGuestBook(e.target.value);
  };

  const addGuestBook = async () => {
    // id: userId
    const res = await addGuestBookAPI({ userId: 1, content: '' });
    console.log(res);
  };

  const modifyGuestBook = async (id: number) => {
    // id: gusetBookId
    const res = await modifyGuestBookAPI({ id: id, userId: 1, content: '' });
    console.log(res);
  };

  useEffect(() => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    // getProfileAPI({ id: 1 });
    // getWithFriendAPI({ id: 1 });
    // getGuestBooks(1);
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
      <GuestBookSection>
        <Text types={'large'}>방명록</Text>
        <GuestBookList>
          <GuestBook
            displayName={'nickname'}
            created_at={'time'}
            content={'a'}
            isMine={true} // userId랑 비교
            id={1}
            isAdd={true}
            guestBook={userGuestBook}
            onChange={onChange}
            addGuestBook={addGuestBook}
          ></GuestBook>
          {guestBooks.map((guest) => {
            return (
              <GuestBook
                displayName={guest.displayName}
                created_at={guest.created_at}
                content={guest.content}
                isMine={true} // userId랑 비교
                id={guest.id}
                isAdd={false}
                guestBook={userGuestBook}
                modifyGuestBook={modifyGuestBook}
                onChange={onChange}
              ></GuestBook>
            );
          })}
        </GuestBookList>
      </GuestBookSection>
    </Wrapper>
  );
};

export default MyPage;
