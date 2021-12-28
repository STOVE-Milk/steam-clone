import {createGlobalStyle} from 'styled-components';
import {normalize} from 'styled-normalize';

export const GlobalStyle = createGlobalStyle`
  ${normalize}
  html {
    box-sizing: border-box;
    font-size: 62.5%;
    min-width: 320px;
  }
  *,
  *::before,
  *::after {
    box-sizing: inherit;
  }
  * { font-family: 'Spoqa Han Sans', 'Spoqa Han Sans JP', 'Sans-serif';}
  a { cursor: pointer; text-decoration: none; }
`;