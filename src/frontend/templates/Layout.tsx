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

const ContentSection = styled.div`
  flex: 1;
`;

export default function Layout({ children }: LayoutProps) {
  return (
    <MainWrapper>
      <NavBar />
      <ContentSection>
        <Header />
        {children}
      </ContentSection>
    </MainWrapper>
  );
}
