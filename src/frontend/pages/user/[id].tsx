import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';

import styled from 'styled-components';

import { parseToken } from 'util/parseToken';
import * as UserAPI from 'api/user/api';
import * as guestAPI from 'api/guestbook/api';
import { IState } from 'modules';
import { IFriendInfo } from 'modules/user';
import { saveUserInfo } from 'modules/user';

import Text from 'components/atoms/Text';
import FriendBox from 'components/molecules/FriendBox';
import UserInfo, { IUserInfo } from 'components/organisms/UserInfo';
import GuestBook, { IGuestBook } from 'components/organisms/GuestBook';

const UserPage: NextPage<IState> = () => {
  const router = useRouter();

  const userInfo = useSelector((state: IState) => state.user.userInfo);
  const userId = Number(router.query.id);

  const [isMypage, setIsMypage] = useState(userId === userInfo.data.idx); // 현재 보고 있는 페이지가 마이 페이지인지, 다른 유저의 페이지인지 여부
  console.log(userId, userInfo.data.idx, isMypage);

  const [guestBooks, setGuestBooks] = useState([] as IGuestBook[]); // 현재 유저 페이지의 방명록
  const [userGuestBook, setUserGuestBook] = useState({} as IGuestBook); // 유저가 작성중인 방명록의 내용

  const [profile, setProfile] = useState({} as IUserInfo); // 현재 유저 페이지의 유저의 정보

  const [withFriend, setWithFriend] = useState([] as IFriendInfo[]); // 현재 유저 페이지의 유저와 함께 아는 친구. 마이페이지면 보이지 않음

  const getProfile = async () => {
    const res = (await UserAPI.getProfileAPI(userInfo.data.idx)).data;
    setProfile(res);
    setUserGuestBook((prev) => ({
      ...prev,
      displayed_name: res.nickname,
      profile: res.profile,
    }));
  };

  const getWithFriend = async () => {
    const res = (await UserAPI.getWithFriendAPI(userId)).data.friends;
    setWithFriend(res);
  };

  const getGuestBooks = async () => {
    const res = (await guestAPI.getGuestBooksAPI(userId)).data.guest_book;
    setGuestBooks(res);
  };

  const addGuestBook = async (content: string) => {
    await guestAPI.addGuestBookAPI(userId, { content: content });
    await getGuestBooks();
  };

  const modifyGuestBook = async (bookId: number, content: string) => {
    await guestAPI.modifyGuestBookAPI(userId, bookId, { content: content });
    await getGuestBooks();
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    const result = token && parseToken(token);
    dispatch(saveUserInfo.request(result));
  }, []);

  useEffect(() => {
    if (userId !== NaN) {
      getProfile();
      getGuestBooks();
      !isMypage && getWithFriend();
    }
  }, [userId]);

  return (
    <Wrapper>
      <Text types={'title'}>유저페이지</Text>
      <UserInfo {...profile}></UserInfo>
      <FriendSection>
        {isMypage ? null : (
          <>
            <Text types={'large'}>함께 아는 친구</Text>
            <FriendList>
              {withFriend.map((friend) => {
                <FriendBox types="" open={true} friendInfo={friend} />;
              })}
            </FriendList>
          </>
        )}
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

export default UserPage;
