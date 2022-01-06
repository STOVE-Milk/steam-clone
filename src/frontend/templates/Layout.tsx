import React from 'react';
import NavBar from 'components/organisms/NavBar';
import styled from 'styled-components';

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
      <ContentSection>{children}</ContentSection>
    </MainWrapper>
  );
}
