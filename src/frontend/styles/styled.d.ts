import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakPoint: string;

    colors: {
      black: string;
      yellow: string;
      orange: string;
      gray: string;
      gray_background: string;
    };
  }
}