import React from 'react';
import styled from 'styled-components';
import { theme } from 'styles/theme';

type SizeType = {
  size: string;
  weight: string;
  color: string;
};

interface ITextThemeType {
  [index: string]: SizeType;
}

export const TextTheme: ITextThemeType = {
  title: {
    size: '3rem',
    weight: 'bold',
    color: theme.colors.primaryText,
  },

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

  main: {
    size: '1rem',
    weight: 'normal',
    color: theme.colors.primaryText,
  },

  tiny: {
    size: '0.8rem',
    weight: 'normal',
    color: theme.colors.secondaryText,
  },
};

export default function Text(props: ITextProps) {
  return <TextStyle {...props}>{props.children}</TextStyle>;
}

Text.defaultProps = {
  types: 'main',
};

export interface ITextProps {
  types: string;
  children: React.ReactNode;
  onClick?: (e: any) => void;
  className?: string;
}

export const TextStyle = styled.div<ITextProps>`
  font-size: ${(props) => TextTheme[props.types].size};
  font-weight: ${(props) => TextTheme[props.types].weight};
  color: ${(props) => TextTheme[props.types].color};
`;
