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
import UserInfo, { IUserInfo } from 'components/organisms/UserInfo';
import FriendBox from 'components/molecules/FriendBox';
import Profile from 'components/atoms/Profile';
import GuestBook, { IGuestBook } from 'components/organisms/GuestBook';

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

const UserPage: NextPage = () => {
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기 (스토어의 userId === 현재 url의 userId 일 때)
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  const [guestBooks, setGuestBooks] = useState<IGuestBook[]>([]);

  const [userGuestBook, setUserGuestBook] = useState<IGuestBook>({
    id: 1,
    guest_id: 1,
    is_friend: 1,
    profile: {
      description: '',
      image: '',
    },
    displayed_name: '',
    content: '',
    created_at: '',
  });

  const [profile, setProfile] = useState<IUserInfo>({
    id: 1,
    nickname: '',
    is_friend: 1,
    profile: {
      description: '',
      image: '',
    },
    accessed_at: '',
    createad_at: '',
  });

  // default: query.userId
  const userId = 1;
  // query.userId === store.userId ? mypage : userpage
  // 내가 지금 보고 있는 유저 페이지가 나의 페이지인가, 다른 유저의 유저 페이지인가
  const [isMypage, setIsMypage] = useState(false);

  const getProfile = async () => {
    const res = (await getProfileAPI(userId)).data;
    setProfile(res);
    setUserGuestBook((prev) => ({
      ...prev,
      displayed_name: res.nickname,
      profile: res.profile,
    }));
  };

  const getWithFriend = async () => {
    const res = await getWithFriendAPI({ id: 4 });
    console.log('getWithFriend', res);
  };

  const getGuestBooks = async () => {
    const res = (await getGuestBooksAPI(userId)).data.guest_books;
    setGuestBooks(res);
  };

  const addGuestBook = async () => {
    await addGuestBookAPI(userId, { content: userGuestBook.content });
  };

  const modifyGuestBook = async (bookId: number, content: string) => {
    // id: gusetBookId
    await modifyGuestBookAPI(userId, bookId, { content: content });
  };

  useEffect(() => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    getProfile();
    getGuestBooks();
    // getWithFriend(); // 2
  }, []);

  return (
    <Wrapper>
      <Text types={'title'}>유저페이지</Text>
      <UserInfo {...profile}></UserInfo>
      <FriendSection>
        <Text types={'large'}>함께 아는 친구</Text>
        {/* {isMypage ? null : (
          <FriendList>
            {friends.map((friend) => {
              return (
                <FriendBox
                  key={friend.id}
                  icon={<Profile userImage={<FontAwesomeIcon icon={faUser} inverse />}></Profile>}
                  name={friend.nickname}
                  open={true}
                ></FriendBox>
              );
            })}
          </FriendList>
        )} */}
      </FriendSection>
      <GuestBookSection>
        <Text types={'large'}>방명록</Text>
        <GuestBookList>
          <GuestBook guestBook={userGuestBook} isAdd={true} addGuestBook={addGuestBook}></GuestBook>
          {guestBooks.map((guestBook) => {
            return (
              <GuestBook
                key={guestBook.id}
                guestBook={guestBook}
                isMine={userId === guestBook.id}
                isAdd={false}
                modifyGuestBook={modifyGuestBook}
              ></GuestBook>
            );
          })}
        </GuestBookList>
      </GuestBookSection>
    </Wrapper>
  );
};

export default UserPage;
