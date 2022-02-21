import { DefaultTheme } from 'styled-components';

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

    divider: '#858c91',

    online: '#ADD1D4',
    offline: '#e26a6a',

    wish: '#ff0080',
  },
};
