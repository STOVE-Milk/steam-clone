import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    breakpoints: {
      small: string;
      medium: string;
      large: string;
    };

    colors: {
      dark: {
        primaryBg: string;
        secondaryBg: string;
        activeBg: string;

        primaryText: string;
        secondaryText: string;

        divider: string;
      };
      light: {
        primaryBg: string;
        secondaryBg: string;
        activeBg: string;

        primaryText: string;
        secondaryText: string;

        divider: string;
      };
    };
  }
}
