import { getColorClasses } from '../../utils/getColorClasses';
import { ButtonProps } from './types';

interface IIconClasses {
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

export function getIconClasses({ variant, loading, disabled }: IIconClasses) {
  if (variant === 'text') {
    return getTextClasses({ loading, disabled });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled });
  }

  return '';
}

interface ITextClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getTextClasses({ loading, disabled }: ITextClasses) {
  const hoverStyle =
    !loading && !disabled
      ? getColorClasses({
          light: 'group-hover:[&>*]:stroke-secondary-dark',
          dark: 'group-hover:[&>*]:stroke-white',
        })
      : '';
  return `${disabled ? 'opacity-50' : ''} ${hoverStyle}`;
}

interface ISecondaryClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getSecondaryClasses({ loading, disabled }: ISecondaryClasses) {
  return `${disabled ? 'opacity-50' : ''} ${hoverStyle}`;
}
