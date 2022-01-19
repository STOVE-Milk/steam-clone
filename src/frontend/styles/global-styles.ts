import { createGlobalStyle } from 'styled-components';
import { theme } from 'styles/theme';

export const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    min-width: 320px;
    overflow-x: hidden;

    ${theme.breakpoints.large}{
      font-size: 16px;
    }
    ${theme.breakpoints.medium}{
      font-size: 15px;
    }
    ${theme.breakpoints.small}{
      font-size: 14px;
    }
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  * { font-family: 'Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif';}
  a { cursor: pointer; text-decoration: none; }
  *:focus {
    outline: none;
  }
  /* 스크롤바 설정*/
  ::-webkit-scrollbar {
    width: 6px;
  }
  /* 스크롤바 막대 설정*/
  ::-webkit-scrollbar-thumb {
    height: 17%;
    background-color: ${(props) => props.theme.colors.divider};
    border-radius: 10px;
  }
  /* 스크롤바 뒷 배경 설정*/
  ::-webkit-scrollbar-track {
    background-color: ${(props) => props.theme.colors.primaryBg};
  }
`;
