import React from 'react';
import styled from 'styled-components';
import NavBar from 'components/organisms/Navbar';
import Header from 'components/organisms/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;
const NavBarSection = styled.div`
  width: 250px;
`;
const ContentSectionWrapper = styled.div`
  flex: 1;
`;
const ContentSection = styled.div`
  width: 100%;
  margin-top: 80px;
  height: calc(100vh - 80px);
  overflow-y: scroll;
  background: ${(props) => props.theme.colors.primaryBg};
`;

export default function Layout({ children }: LayoutProps) {
  return (
    <MainWrapper>
      <NavBarSection>
        <NavBar />
      </NavBarSection>
      <ContentSectionWrapper>
        <Header />
        <ContentSection>{children}</ContentSection>
      </ContentSectionWrapper>
    </MainWrapper>
  );
}
