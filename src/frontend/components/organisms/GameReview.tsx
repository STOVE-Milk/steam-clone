import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { IUserInfo } from 'modules/user/types';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';

export interface IReview {
  //리뷰 객체 타입
  id: number;
  user_id: number;
  displayed_name: string;
  content: string;
  recommendation: boolean;
  created_at: string;
  updated_at: string;
}

export interface IReviewProps {
  review: IReview;
  userInfo: IUserInfo;
  addReview?: () => Promise<void>;
  modifyReview?: (id: number) => Promise<void>;
  setRecommend: (r: boolean) => void;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export default function GameReview(props: IReviewProps) {
  const [isEdited, setEdited] = useState(props.review.id === undefined ? true : false); //유저가 등록/수정 중인지 여부

  return (
    <ReviewWrapper>
      <UserBox>
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        <Name types="medium">{props.review.displayed_name}</Name>
        {isEdited ? (
          <>
            <ThumbsDown
              onClick={() => props.setRecommend(false)}
              userReview={props.review}
              isEdited={isEdited}
              icon={faThumbsDown}
              inverse
            />
            <ThumbsUp
              onClick={() => props.setRecommend(true)}
              userReview={props.review}
              isEdited={isEdited}
              icon={faThumbsUp}
              inverse
            />
          </>
        ) : (
          <>
            {props.review.recommendation ? (
              <ThumbsUp isEdited={false} icon={faThumbsUp} inverse />
            ) : (
              <ThumbsDown isEdited={false} icon={faThumbsDown} inverse />
            )}
            <CreatedAt types="tiny">{`${props.review.created_at} ${
              props.review.created_at !== props.review.updated_at ? '(수정됨)' : ''
            }`}</CreatedAt>
          </>
        )}
        {isEdited ? (
          <PostActionBox>
            <FilledButton
              types="primary"
              onClick={() =>
                isEdited
                  ? props.modifyReview && props.modifyReview(props.review.id)
                  : props.addReview && props.addReview()
              }
            >
              등록
            </FilledButton>
          </PostActionBox>
        ) : null}
        {!isEdited && props.userInfo && props.userInfo.idx === props.review.user_id ? (
          <PostActionBox>
            <FilledButton types="primary" onClick={() => setEdited(true)}>
              수정
            </FilledButton>
          </PostActionBox>
        ) : null}
      </UserBox>
      <Divider />
      {props.review.id === undefined || isEdited ? (
        <EditBox value={props.review.content} onChange={(e) => props.onChange && props.onChange(e)}></EditBox>
      ) : (
        <TextBox>
          {props.review.content.split('\n').map((text, key) => (
            <p key={key}> {text} </p>
          ))}
        </TextBox>
      )}
    </ReviewWrapper>
  );
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

const ThumbsUp = styled(FontAwesomeIcon)<{ isEdited: boolean; userReview?: { recommendation: boolean } }>`
  margin-left: 0.3rem;
  color: ${(props) => (props.isEdited && props.userReview?.recommendation ? props.theme.colors.activeBg : 'white')};
`;

const ThumbsDown = styled(FontAwesomeIcon)<{ isEdited: boolean; userReview?: { recommendation: boolean } }>`
  margin: 0.7rem 0 0 0.3rem;
  color: ${(props) => (props.isEdited && !props.userReview?.recommendation ? props.theme.colors.activeBg : 'white')};
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

const EditBox = styled.textarea`
  line-height: 1.3rem;
  background: transparent;
  border: 1px solid ${(props) => props.theme.colors.divider};
  border-radius: 10px;
  color: ${(props) => props.theme.colors.secondaryText};
  padding: 1rem;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TextBox = styled.div`
  color: ${(props) => props.theme.colors.secondaryText};
  line-height: 1.3rem;
`;
