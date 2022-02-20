import React, { useState } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faThumbsUp, faThumbsDown } from '@fortawesome/free-solid-svg-icons';

import { IUserInfo } from 'modules/user/types';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';
import FilledButton from 'components/atoms/FilledButton';
import { userInfo } from 'os';

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
  isFirst: boolean;
  review: IReview;
  userInfo?: IUserInfo;
  addReview?: (content: string, recommend: boolean) => Promise<void>;
  modifyReview: (id: number, content: string, recommend: boolean) => Promise<void>;
}

export default function GameReview(props: IReviewProps) {
  const [isEdited, setEdited] = useState(props.isFirst ? true : false); //유저가 게임 리뷰를 작성하고 있는중인가
  const [content, setContent] = useState(props.isFirst ? '' : props.review.content);
  const [recommend, setRecommend] = useState(true);
  console.log(props.userInfo, props.review);

  return (
    <ReviewWrapper>
      <UserBox>
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        <Name types="medium">{props.userInfo ? props.userInfo.nickname : props.review.displayed_name}</Name>
        {isEdited ? (
          <>
            <ThumbsDown
              onClick={() => setRecommend(false)}
              recommend={recommend}
              isEdited={isEdited}
              icon={faThumbsDown}
              inverse
            />
            <ThumbsUp
              onClick={() => setRecommend(true)}
              recommend={recommend}
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
            {!props.isFirst ? (
              <CreatedAt types="tiny">{`${new Date(props.review.created_at)} ${
                props.review.created_at !== props.review.updated_at ? '(수정됨)' : ''
              }`}</CreatedAt>
            ) : null}
          </>
        )}
        {isEdited ? (
          <PostActionBox>
            <FilledButton
              types="primary"
              onClick={() => {
                if (props.isFirst) {
                  props.addReview && props.addReview(content, recommend);
                  setEdited(false);
                } else {
                  props.modifyReview && props.modifyReview(props.review.id, content, recommend);
                  setEdited(false);
                }
              }}
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
      {props.isFirst || isEdited ? (
        <EditBox value={content} onChange={(e) => setContent(e.target.value)}></EditBox>
      ) : (
        <TextBox>
          {props.review.content && props.review.content.split('\n').map((text, key) => <p key={key}> {text} </p>)}
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

const ThumbsUp = styled(FontAwesomeIcon)<{ isEdited: boolean; recommend?: boolean }>`
  margin-left: 0.3rem;
  color: ${(props) => (props.isEdited && props.recommend ? props.theme.colors.online : 'white')};
`;

const ThumbsDown = styled(FontAwesomeIcon)<{ isEdited: boolean; recommend?: boolean }>`
  margin: 0.7rem 0 0 0.3rem;
  color: ${(props) => (props.isEdited && !props.recommend ? props.theme.colors.offline : 'white')};
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
