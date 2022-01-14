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
`;
