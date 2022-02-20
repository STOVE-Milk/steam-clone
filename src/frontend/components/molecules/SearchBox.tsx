import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { getSearchData } from 'modules/game';

import SelectBox from 'components/atoms/SelectBox';

interface ISearchbox {
  option: string;
  inputText: string;
  setOption: (e: any) => void;
  setInputText: (e: any) => void;
}

export default function SearchBox({ option, inputText, setOption, setInputText }: ISearchbox) {
  const dispatch = useDispatch();

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
  const router = useRouter();

  // useEffect(() => {
  //   //처음에 실행 x
  //   submitSearchInfo();
  // }, [inputText]);

  const submitSearchInfo = () => {
    // option, inputText을 이용해서 검색 통신 할때 사용될 예쟝
    console.log(option, inputText);
    if (inputText === '') alert('검색어를 입력해주세요!');
    else dispatch(getSearchData.request({ keyword: inputText.trim() }));

    router.push(`/search?${inputText.trim()}`);
  };
  const onKeyPress = (e: any) => {
    if (e.key === 'Enter') {
      submitSearchInfo();
    }
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
        onKeyPress={onKeyPress}
      />
      <FontAwesomeIconStyle icon={faSearch} inverse onClick={() => submitSearchInfo()} />
    </SearchBoxWrapper>
  );
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
