import React from 'react';
import styled from 'styled-components';
import { theme } from 'styles/theme';

type SizeType = {
  size: string;
  weight: string;
  color: string;
};

interface TextThemeType {
  [index: string]: SizeType;
}

const TextTheme: TextThemeType = {
  large: {
    size: '1.5rem',
    weight: 'bold',
    color: theme.colors.primaryText,
  },

  medium: {
    size: '1.3rem',
    weight: 'bold',
    color: theme.colors.primaryText,
  },

  small: {
    size: '1.2rem',
    weight: 'bold',
    color: theme.colors.secondaryText,
  },

  tiny: {
    size: '0.8rem',
    weight: 'normal',
    color: theme.colors.secondaryText,
  },

  main: {
    size: '1rem',
    weight: 'normal',
    color: theme.colors.primaryText,
  },
};

export interface TextProps {
  types: string;
  children: React.ReactNode;
}

export const TextStyle = styled.div<TextProps>`
  font-size: ${(props) => TextTheme[props.types].size};
  font-weight: ${(props) => TextTheme[props.types].weight};
  color: ${(props) => TextTheme[props.types].color};
`;

export default function Text(props: TextProps) {
  return <TextStyle {...props}>{props.children}</TextStyle>;
}
