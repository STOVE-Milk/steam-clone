import React from 'react';
import styled from 'styled-components';
import DefaultButton from 'components/atoms/DefaultButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import Text from 'components/atoms/Text';

const SearchBoxWrapper = styled.div`
  width: 40%;
  display: flex;
  ${(props) => props.theme.breakpoints.medium} {
    display: none;
  }
`;

const SelectTagBox = styled.select`
  border: none;
  padding: 0.8rem 0.5rem;
  font-family: inherit;
  border-radius: 0px;
  background-color: ${(props) => props.theme.colors.secondaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;

const InputStyle = styled.input`
  flex: 1;
  padding: 0.25rem 0.25rem;
  border: 1px solid ${(props) => props.theme.colors.secondaryBg};
  background-color: ${(props) => props.theme.colors.secondaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;

export default function Search() {
  return (
    <SearchBoxWrapper>
      <SelectTagBox>
        <option value="gamename" className="fa icon">
          게임이름
        </option>
        <option value="tag">태그</option>
      </SelectTagBox>
      <InputStyle placeholder={'Search Everything!'} />
      <DefaultButton types="primary">
        <FontAwesomeIcon icon={faSearch} />
        검색
      </DefaultButton>
    </SearchBoxWrapper>
  );
}
