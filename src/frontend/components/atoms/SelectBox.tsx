import React from 'react';
import styled from 'styled-components';

type OptionType = {
  en: string;
  kr: string;
};
interface IhandleEvent {
  optionArr: Array<OptionType>;
  handleSelect: (e: any) => void;
}
const SelectTagBox = styled.select`
  border: none;
  padding: 0.8rem 0.5rem;
  font-family: inherit;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.primaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;

export default function SelectBox({ optionArr, handleSelect }: IhandleEvent) {
  return (
    <SelectTagBox onChange={(e) => handleSelect(e)}>
      {optionArr.map((option, i) => {
        return <option value={`${option.en}`} key={i}>{`${option.kr}`}</option>;
      })}
    </SelectTagBox>
  );
}
