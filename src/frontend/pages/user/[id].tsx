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
  /* 로그인 이후 뷰 처리
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();

  // TODO: url의 Id 가져와서 스토어의 Id와 비교하기
  // query.userId === store.userId ? mypage : userpage

  // default: query.userId
  */
  const userId = 1;
  const [isMypage, setIsMypage] = useState(false);

  const [guestBooks, setGuestBooks] = useState([] as IGuestBook[]);
  const [userGuestBook, setUserGuestBook] = useState({} as IGuestBook);

  const [profile, setProfile] = useState({} as IUserInfo);

  const [withFriend, setWithFriend] = useState({} as IUserInfo);

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
  };

  const getGuestBooks = async () => {
    const res = (await getGuestBooksAPI(userId)).data.guest_books;
    setGuestBooks(res);
  };

  const addGuestBook = async (content: string) => {
    await addGuestBookAPI(userId, { content: content });
    await getGuestBooks();
  };

  const modifyGuestBook = async (bookId: number, content: string) => {
    await modifyGuestBookAPI(userId, bookId, { content: content });
    await getGuestBooks();
  };

  useEffect(() => {
    // (스토어의 userId !== 현재 url의 userId 일 때)
    getProfile();
    getGuestBooks();
  }, []);

  return (
    <Wrapper>
      <Text types={'title'}>유저페이지</Text>
      <UserInfo {...profile}></UserInfo>
      <FriendSection>
        <Text types={'large'}>함께 아는 친구</Text>
        {/* 
        TODO: 마이페이지가 아닐 때만 함께 아는 친구 보여주기
        {isMypage ? null : (
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
                isMine={userId === guestBook.guest_id}
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
