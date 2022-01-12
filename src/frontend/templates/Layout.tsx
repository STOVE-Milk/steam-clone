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
const ContentSectionWrapper = styled.div`
  flex: 1;
`;
const ContentSection = styled.div`
  margin-top: 80px;
  height: calc(100vh - 80px);
  background: ${(props) => props.theme.colors.primaryBg};
`;

export default function Layout({ children }: LayoutProps) {
  return (
    <MainWrapper>
      <NavBar />
      <ContentSectionWrapper>
        <Header />
        <ContentSection>{children}</ContentSection>
      </ContentSectionWrapper>
    </MainWrapper>
  );
}
