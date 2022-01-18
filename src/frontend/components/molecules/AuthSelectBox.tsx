import React from 'react';
import styled from 'styled-components';
import { IOption } from 'pages/signup';
import Text from 'components/atoms/Text';

interface IOptionProp {
  option: Array<IOption>;
}

const SelectWrapper = styled.div`
  margin-top: 2rem;
`;
const InputTitleText = styled(Text)`
  margin-bottom: 0.5rem;
`;
const SelectStyle = styled.select`
  background: ${(props) => props.theme.colors.plain};
  border: 1px solid ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
  padding: 0.5rem 1rem;
  margin-right: 0.5rem;
  width: 14rem;
  ${(props) => props.theme.breakpoints.medium} {
    width: 10rem;
  }
`;

interface IOptionProp {
  title: string;
  option: Array<IOption>;
}

export default function AuthSelectBox({ title, option }: IOptionProp) {
  const optionArr = option.map((each, i) => {
    return <option key={i} value={`${each.name}`}>{`${each.name}`}</option>;
  });
  // console.log(optionArr);
  return (
    <SelectWrapper>
      <InputTitleText>{title}</InputTitleText>
      <SelectStyle>{optionArr}</SelectStyle>
    </SelectWrapper>
  );
}
