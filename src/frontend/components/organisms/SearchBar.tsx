import React from 'react';
import styled from 'styled-components';

interface SearchBarProps {
  hintText?: string;
  keyword?: string;
  onChanged?: (e: Event) => void;
  onClick?: (keyword: String) => void;
}

const SearchBarWrapper = styled.div`
  width: 90%;
  height: 50px;
  background: ${(props) => props.theme.colors.main};
  color: white;
  border-radius: 10px;
  display: flex;
  padding: 5px;
`;

const SearchBarInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  border-bottom: 1px solid white;
`;

const SearchButton = styled.button`
  border-radius: 10px;
  width: 30px;
  height: 30px;
`;

export default function SearchBar(props: SearchBarProps) {
  return (
    <SearchBarWrapper>
      <SearchBarInput></SearchBarInput>
      <SearchButton></SearchButton>
    </SearchBarWrapper>
  );
}
