import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

import Profile from 'components/atoms/Profile';
import Text from 'components/atoms/Text';

const ReviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  background-color: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
`;

const UserBox = styled.div`
  display: flex;
`;

const Name = styled(Text)`
  margin: 0.2rem 0.7rem 0 0.3rem;
`;

const CreatedAt = styled(Text)`
  margin-top: 0.8rem;
`;

const Divider = styled.div`
  height: 1px;
  background-color: ${(props) => props.theme.colors.divider};
  margin: 0.8rem 0;
`;

const TextBox = styled.div``;

export default function GameReview() {
  return (
    <ReviewWrapper>
      <UserBox>
        <Profile userImage={<FontAwesomeIcon icon={faUser} inverse width={30} height={30} />} />
        <Name types="medium">이름</Name>
        <CreatedAt types="tiny">작성 시간</CreatedAt>
      </UserBox>
      <Divider />
      <TextBox>리뷰 내용</TextBox>
    </ReviewWrapper>
  );
}
