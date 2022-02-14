import React, { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import styled from 'styled-components';

import * as UserAPI from 'api/user/api';
import * as guestAPI from 'api/guestbook/api';

import Text from 'components/atoms/Text';
import FriendBox, { IFriend } from 'components/molecules/FriendBox';
import UserInfo, { IUserInfo } from 'components/organisms/UserInfo';
import GuestBook, { IGuestBook } from 'components/organisms/GuestBook';

const UserPage: NextPage = () => {
  /* 로그인 이후 뷰 처리
  
  // TODO: 로그인 후, 스토어에서 유저 정보 가져오기
  // const { user } = useSelector((state: IState) => state.user);
  // const dispatch = useDispatch();
  */
  const userId = 1; // TODO: url의 Id 가져와서 스토어의 Id와 비교하기
  const [isMypage, setIsMypage] = useState(false); // 현재 보고 있는 페이지가 마이 페이지인지, 다른 유저의 페이지인지 여부

  const [guestBooks, setGuestBooks] = useState([] as IGuestBook[]); // 현재 유저 페이지의 방명록
  const [userGuestBook, setUserGuestBook] = useState({} as IGuestBook); // 유저가 작성중인 방명록의 내용

  const [profile, setProfile] = useState({} as IUserInfo); // 현재 유저 페이지의 유저의 정보

  const [withFriend, setWithFriend] = useState([] as IFriend[]); // 현재 유저 페이지의 유저와 함께 아는 친구. 마이페이지면 보이지 않음

  const getProfile = async () => {
    const res = (await UserAPI.getProfileAPI(userId)).data;
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
    const res = (await guestAPI.getGuestBooksAPI(userId)).data.guest_books;
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

  useEffect(() => {
    getProfile();
    getGuestBooks();
    !isMypage && getWithFriend();
  }, []);

  return (
    <Wrapper>
      <Text types={'title'}>유저페이지</Text>
      <UserInfo {...profile}></UserInfo>
      <FriendSection>
        <Text types={'large'}>함께 아는 친구</Text>
        {isMypage ? null : (
          <FriendList>
            {withFriend.map((friend) => {
              <FriendBox open={true} friendInfo={friend} />;
            })}
          </FriendList>
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
