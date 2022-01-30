import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

export interface IReviewProps {
  isMine: boolean;
  name: string;
  time: string;
  text: string;
  recommendation: boolean;
}

const ReviewWrapper = styled.div`
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

const ThumbsUp = styled(FontAwesomeIcon)`
  margin-left: 0.3rem;
`;

const ThumbsDown = styled(FontAwesomeIcon)`
  margin: 0.7rem 0 0 0.3rem;
`;

const CreatedAt = styled(Text)`
  margin: 0.3rem 0 0 1rem;
`;

const PostActionBox = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
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

export default function GameReview(props: IReviewProps) {
  return (
    <ReviewWrapper>
      <UserBox>
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        <Name types="medium">{props.name}</Name>
        {props.recommendation ? <ThumbsUp icon={faThumbsUp} inverse /> : <ThumbsDown icon={faThumbsDown} inverse />}
        <CreatedAt types="tiny">{props.time}</CreatedAt>
        <PostActionBox>
          <FilledButton types="primary">수정</FilledButton>
          <FilledButton types="primary">삭제</FilledButton>
        </PostActionBox>
      </UserBox>
      <Divider />
      <TextBox>
        {props.text.split('\n').map((text, key) => (
          <p key={key}> {text} </p>
        ))}
      </TextBox>
    </ReviewWrapper>
  );
}
