import React from 'react';
import styled from 'styled-components';

interface ISelectOptionInfo {
  name: string;
  value: string;
  disabled?: boolean;
}

interface ISelectProps {
  optionArr: Array<ISelectOptionInfo>;
  handleSelect: (e: any) => void;
}
const SelectTagBox = styled.select`
  border: none;
  padding: 0.8rem 1rem;
  font-family: inherit;
  border-radius: 10px;
  background-color: ${(props) => props.theme.colors.secondaryBg};
  color: ${(props) => props.theme.colors.secondaryText};
`;

export default function CommonSelectBox({ optionArr, handleSelect }: ISelectProps) {
  return (
    <SelectTagBox onClick={(e) => handleSelect(e)}>
      {optionArr.map((option, i) => {
        return <option value={`${option.value}`} key={i} disabled={option.disabled}>{`${option.name}`}</option>;
      })}
    </SelectTagBox>
  );
}
CommonSelectBox.defaultProps = {
  handleSelect: () => console.log('Selectbox clicked'),
};
