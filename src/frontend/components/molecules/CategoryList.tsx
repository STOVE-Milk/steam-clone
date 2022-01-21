import React from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';

interface IGameCategory {
  list: Array<string> | null;
}
const CategoryWrapper = styled.section`
  display: flex;
  width: 60rem;
  margin: 0.5rem;
  flex-wrap: wrap;
  ${(props) => props.theme.breakpoints.medium} {
    width: 40rem;
  }
  ${(props) => props.theme.breakpoints.small} {
    width: 20rem;
  }
`;
const CategoryBox = styled(Text)`
  border: 1px solid ${(props) => props.theme.colors.divider};
  background-color: ${(props) => props.theme.colors.secondaryBg};
  border-radius: 10px;
  margin: 0 0.5rem 0.5rem 0;
  padding: 0 0.5rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background: ${(props) => props.theme.colors['activeBg']};
    border: 1px solid ${(props) => props.theme.colors.activeBg};
  }
`;

export default function CategoryList({ list }: IGameCategory) {
  return (
    <CategoryWrapper>
      {list &&
        list.map((eachCategory, i) => {
          return <CategoryBox key={i}>{eachCategory}</CategoryBox>;
        })}
    </CategoryWrapper>
  );
}
