import { IconType } from '@akashaorg/typings/ui';

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
};

export type Variant = 'primary' | 'secondary' | 'text';

export type ButtonSize = 'xsmall' | 'small' | 'regular' | 'large';
