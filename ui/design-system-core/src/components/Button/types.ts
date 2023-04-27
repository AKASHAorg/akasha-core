import { IconType } from '@akashaorg/typings/ui';
import { LegacyRef } from 'react';
import { BasicSize, BreakPointSize } from '../types/common.types';

export type ButtonProps = {
  label?: string;
  icon?: IconType;
  iconDirection?: 'left' | 'right';
  size?: ButtonSize;
  variant?: Variant;
  disabled?: boolean;
  loading?: boolean;
  iconOnly?: boolean;
  greyBg?: boolean;
  plain?: boolean;
  breakPointSize?: BreakPointSize;
  customStyle?: string;
  active?: boolean;
  hover?: boolean;
  ref?: LegacyRef<HTMLButtonElement>;
} & React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export type Variant = 'primary' | 'secondary' | 'text';

export type ButtonSize = Exclude<BasicSize, 'xl'>;
