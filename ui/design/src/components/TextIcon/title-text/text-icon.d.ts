import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { IconType } from '../../Icon/icon';
import { TextProps } from 'grommet';
export interface ITextIconProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  iconBackground?: boolean;
  color?: string;
  spacing?: string;
  label?: string;
  iconType: IconType;
  iconStyle?: React.CSSProperties;
  clickable?: boolean;
  menuActive?: boolean;
  menuIcon?: boolean;
  iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | string;
  fontWeight?: 'normal' | 'bold' | number;
  primaryColor?: boolean;
  accentColor?: boolean;
  reverse?: boolean;
  fadedText?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
}
export interface IStyledTextProps extends TextProps {
  accentColor?: boolean;
  disabled?: boolean;
}
declare const TextIcon: React.FC<ITextIconProps>;
export default TextIcon;
