import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import DefaultButton from 'components/atoms/DefaultButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import SelectBox from 'components/atoms/SelectBox';

interface ISearchbox {
  option: string;
  inputText: string;
  setOption: (e: any) => void;
  setInputText: (e: any) => void;
}
const SearchBoxWrapper = styled.div`
  width: 60%;
  display: flex;
  align-items: center;
`;

const InputStyle = styled.input`
  flex: 1;
  padding: 0.25rem 0.25rem;
  border: 1px solid ${(props) => props.theme.colors.primaryBg};
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;
const FontAwesomeIconStyle = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

export default function SearchBox({ option, inputText, setOption, setInputText }: ISearchbox) {
  const optionName = [
    { EN: 'name', KR: '게임이름' },
    { EN: 'tag', KR: '태그' },
  ];

  const handleSelect = useCallback((e: any) => {
    setOption(e.target.value);
  }, []);

  const handleInputText = useCallback((e) => {
    const searchText = e.target.value;
    setInputText(searchText);
  }, []);

  const submitSearchInfo = () => {
    // option, inputText을 이용해서 검색 통신 할때 사용될 예쟝
    console.log(option, inputText);
    if (inputText === '') alert('검색어를 입력해주세요!');
  };

  return (
    <SearchBoxWrapper>
      <SelectBox optionArr={optionName} handleSelect={(e) => handleSelect(e)} />
      {/* TO DO(양하): enter 이벤트 넣기 */}
      <InputStyle
        type="text"
        placeholder={'Search Everything!'}
        id="searchText"
        defaultValue=""
        onChange={(e) => handleInputText(e)}
      />
      <FontAwesomeIconStyle icon={faSearch} inverse onClick={() => submitSearchInfo()} />
    </SearchBoxWrapper>
  );
}
