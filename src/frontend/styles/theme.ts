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
    primaryBg: '#313640',
    secondaryBg: '#3a3e48',
    activeBg: '#7372FE',

    primaryText: '#ffffff',
    secondaryText: '#C7CED4',

    divider: '#C7CED4',
  },
};

export const theme: DefaultTheme = {
  breakpoints: {
    small: '@media screen and (max-width: 639px)',
    medium: '@media screen and (max-width: 1047px)',
    large: '@media screen and (min-width: 1048px)',
  },
  colors: {
    primaryBg: '#212327',
    secondaryBg: '#313640',

    activeBg: '#776BD6',

    plain: '#ffffff',

    primaryText: '#ffffff',
    secondaryText: '#C7CED4',

    divider: '#C7CED4',

    online: '#ADD1D4',
    offline: '',

    wish: '#ff0080',
  },
};

export const lightTheme = { ...theme, ...light };
export const darkTheme = { ...theme, ...dark };
