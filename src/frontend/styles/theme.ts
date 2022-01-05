import { DefaultTheme } from 'styled-components';

const dark = {
  colors: {
    primaryBg: '#2F3137',
    secondaryBg: '#3E4149',
    activeBg: '#7372FE',

    primaryText: '#ffffff',
    secondaryText: '#C7CED4',

    divider: '#C7CED4',
  },
};

const light = {
  colors: {
    primaryBg: '#2F3137',
    secondaryBg: '#3E4149',
    activeBg: '#7372FE',

    primaryText: '#ffffff',
    secondaryText: '#C7CED4',

    divider: '#C7CED4',
  },
};

export const theme: DefaultTheme = {
  breakpoints: {
    small: '@media (max-width: 639px)',
    medium: '@media (max-width: 1047px)',
    large: '@media (min-width: 1048px)',
  },
  colors: {
    primaryBg: '#2F3137',
    secondaryBg: '#3E4149',

    activeBg: '#7372FE',

    plain: '#ffffff',

    primaryText: '#ffffff',
    secondaryText: '#C7CED4',

    divider: '#C7CED4',

    online: '#ADD1D4',
    offline: '',
  },
};

export const lightTheme = { ...theme, ...light };
export const darkTheme = { ...theme, ...dark };
