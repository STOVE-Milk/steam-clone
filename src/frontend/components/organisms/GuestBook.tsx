import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

export interface IGuestBook {
  id: number;
  guest_id: number;
  is_friend: number;
  profile: {
    description: string;
    image: string;
  };
  displayed_name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface IGuestBookProps {
  guestBook: IGuestBook;
  isMine?: boolean; //내가 등록한 방명록인가
  isAdd: boolean;
  addGuestBook?: (content: string) => Promise<void>;
  modifyGuestBook?: (id: number, content: string) => Promise<void>;
}

export default function GuestBook(props: IGuestBookProps) {
  const [isEdited, setEdited] = useState(props.isAdd ? true : false); //유저가 방명록을 작성중인지 

  const [content, setContent] = useState(props.isAdd ? '' : props.guestBook.content); //유저가 작성중인 방명록 내용
  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const router = useRouter();

  return (
    <Wrapper>
      <UserBox>
        <Profile
          onClick={() => router.push(`${props.guestBook.guest_id}`)}
          userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />}
        />
        <Name types="medium">{props.guestBook.displayed_name}</Name>
        <CreatedAt types="tiny">
          {props.guestBook.updated_at === props.guestBook.created_at
            ? props.guestBook.created_at
            : `${props.guestBook.updated_at} (수정됨)`}
        </CreatedAt>
        {isEdited ? (
          <PostButton
            types="primary"
            onClick={() => {
              if (props.isAdd) {
                props.addGuestBook && props.addGuestBook(content);
                setContent('');
              } else {
                props.modifyGuestBook && props.modifyGuestBook(props.guestBook.id, content);
                setContent(content);
                setEdited(false);
              }
            }}
          >
            등록
          </PostButton>
        ) : null}
        {!isEdited && props.isMine ? (
          <PostButton types="primary" onClick={() => setEdited(true)}>
            수정
          </PostButton>
        ) : null}
      </UserBox>

      <Divider />
      {isEdited ? (
        <EditBox value={content} onChange={(e) => onChange(e)}></EditBox>
      ) : (
        <TextBox>
          {props.guestBook.content.split('\n').map((text, key) => (
            <p key={key}> {text} </p>
          ))}
        </TextBox>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
  margin: 1rem 0;
`;

const UserBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Name = styled(Text)`
  margin: 0 0.7rem 0 0.3rem;
`;

const PostButton = styled(FilledButton)`
  margin-left: auto;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.divider};
  margin: 0.8rem 0;
`;

const EditBox = styled.textarea`
  line-height: 1.3rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.divider};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.secondaryText};
  ::-webkit-scrollbar {
    display: none;
  }
  padding: 0.5rem;
`;

const TextBox = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  line-height: 1.3rem;
`;

const CreatedAt = styled(Text)`
  margin: 0.3rem 0 0 1rem;
`;
