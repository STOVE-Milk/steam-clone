import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  breakpoints: {
    small: '@media (max-width: 639px)',
    medium: '@media (max-width: 1047px)',
    large: '@media (min-width: 1048px)',
  },

  colors: {
    dark: {
      primaryBg: '#2F3137',
      secondaryBg: '#3E4149',
      activeBg: '#7372FE',

      primaryText: '#ffffff',
      secondaryText: '#C7CED4',

      divider: '#C7CED4',
    },

    light: {
      primaryBg: '#ffffff',
      secondaryBg: '#ffffff',
      activeBg: '#6A5CD0',

      primaryText: '#000000',
      secondaryText: '#9D9CA5',

      divider: '#C7CED4',
    },
  },
};
