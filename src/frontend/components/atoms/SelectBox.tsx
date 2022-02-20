import React from 'react';
import styled from 'styled-components';

type OptionType = {
  EN: string;
  KR: string;
};
interface IhandleEvent {
  optionArr: Array<OptionType>;
  handleSelect: (e: any) => void;
}

export default function SelectBox({ optionArr, handleSelect }: IhandleEvent) {
  return (
    <SelectTagBox onChange={(e) => handleSelect(e)}>
      {optionArr.map((option, i) => {
        return <option value={`${option.EN}`} key={i}>{`${option.KR}`}</option>;
      })}
    </SelectTagBox>
  );
}

const SelectTagBox = styled.select`
  border: none;
  padding: 0.8rem 0.5rem;
  font-family: inherit;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;
