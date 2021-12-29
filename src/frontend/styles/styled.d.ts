import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakPoint: string;

    colors: {
      main: string;
      header: string;
      input: string;
      text: string;
    };
  }
}
