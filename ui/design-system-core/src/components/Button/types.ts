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
  leftIcon?: boolean;
  iconOnly?: boolean;
  greyBg?: boolean;
  plain?: boolean;
  breakPointSize?: BreakPointSize;
  customStyle?: string;
  as?: 'button' | 'a';
  ref?: LegacyRef<HTMLButtonElement>;
};

export type Variant = 'primary' | 'secondary' | 'text';

export type ButtonSize = Exclude<BasicSize, 'xl'>;
