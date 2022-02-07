import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

export interface IGuestBookProps {
  id: number;
  displayName: string;
  created_at: string;
  content: string;
  isMine: boolean;
  isAdd: boolean;
  addGuestBook?: () => Promise<void>;
  modifyGuestBook?: (id: number) => Promise<void>;
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

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.divider};
  margin: 0.8rem 0;
`;

const TextBox = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  line-height: 1.3rem;
`;

const CreatedAt = styled(Text)`
  margin: 0.3rem 0 0 1rem;
`;

export default function GuestBook(props: IGuestBookProps) {
  const [isEdited, setEdited] = useState(props.isAdd ? true : false);

  return (
    <Wrapper>
      <UserBox>
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        <Name types="medium">{props.displayName}</Name>
        <CreatedAt types="tiny">{props.created_at}</CreatedAt>
      </UserBox>
      {isEdited ? (
        <FilledButton
          types="primary"
          onClick={() =>
            isEdited
              ? props.modifyGuestBook && props.id && props.modifyGuestBook(props.id)
              : props.addGuestBook && props.addGuestBook()
          }
        >
          등록
        </FilledButton>
      ) : null}
      {!isEdited && props.isMine ? (
        <FilledButton types="primary" onClick={() => setEdited(true)}>
          수정
        </FilledButton>
      ) : null}
      <Divider />
      <TextBox>
        {props.content.split('\n').map((text, key) => (
          <p key={key}> {text} </p>
        ))}
      </TextBox>
    </Wrapper>
  );
}
