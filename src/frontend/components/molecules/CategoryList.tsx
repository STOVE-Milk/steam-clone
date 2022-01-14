import React from 'react';
import styled from 'styled-components';
import Text from 'components/atoms/Text';

interface IGameCategory {
  list: Array<string>;
}
const CategoryWrapper = styled.section`
  display: flex;
  width: 60rem;
  margin: 0.5rem;
  flex-wrap: wrap;
  /* overflow-x: scroll;
  overflow-y: hidden; */
`;
const CategoryBox = styled(Text)`
  border: 1px solid ${(props) => props.theme.colors.divider};
  padding: 0 0.2rem;
  min-width: 10rem;
  max-width: 10rem;
  height: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default function CategoryList({ list }: IGameCategory) {
  return (
    <CategoryWrapper>
      {list.map((eachCategory) => {
        return <CategoryBox>{eachCategory}</CategoryBox>;
      })}
    </CategoryWrapper>
  );
}
