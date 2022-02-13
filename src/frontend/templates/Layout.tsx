import React from 'react';
import styled from 'styled-components';
import NavBar from 'components/organisms/NavBar';
import Header from 'components/organisms/Header';

interface LayoutProps {
  children: React.ReactNode;
}

const MainWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  font-family: AppleSDGothic;
`;
const ContentSectionWrapper = styled.div`
  width: 100%;
`;
const ContentSection = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  background: ${(props) => props.theme.colors.primaryBg};
  overflow-y: scroll;
  ${(props) => props.theme.breakpoints.small} {
    width: calc(100vw - 117px);
  }
  float: right;
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
