import { getColorClasses } from '../../utils/getColorClasses';
import { ButtonProps } from './types';

interface IIconClasses {
  greyBg: ButtonProps['greyBg'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

export function getIconClasses({ greyBg, variant, loading, disabled }: IIconClasses) {
  if (variant === 'text') {
    return getTextClasses({ loading, disabled });
  }

  if (variant === 'contained') {
    return getContainedClasses({ greyBg });
  }

  if (variant === 'outlined') {
    return getOutlinedClasses({ loading, disabled });
  }

  return '';
}

interface ITextClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getTextClasses({ loading, disabled }: ITextClasses) {
  const iconStrokeStyle = getColorClasses({
    light: disabled ? '[&>*]:stroke-secondary-light/50' : '[&>*]:stroke-secondary-light',
    dark: disabled ? '[&>*]:stroke-secondary-dark/50' : '[&>*]:stroke-secondary-dark',
  });
  const hoverStyle =
    !loading && !disabled
      ? getColorClasses({
          light: 'group-hover:[&>*]:stroke-secondary-dark',
          dark: 'group-hover:[&>*]:stroke-white',
        })
      : '';
  return `${iconStrokeStyle} ${hoverStyle}`;
}

interface IContainedClasses {
  greyBg: ButtonProps['greyBg'];
}

function getContainedClasses({ greyBg }: IContainedClasses) {
  let iconStrokeStyle = '[&>*]:stroke-white';

  if (greyBg) {
    iconStrokeStyle = getColorClasses({
      light: '[&>*]:stroke-secondary-light',
      dark: '[&>*]:stroke-secondary-dark',
    });
  }

  return iconStrokeStyle;
}

interface IOutlinedClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getOutlinedClasses({ loading, disabled }: IOutlinedClasses) {
  const iconStrokeStyle = getColorClasses({
    light: '[&>*]:stroke-secondary-light',
    dark: '[&>*]:stroke-secondary-dark',
  });
  const hoverStyle =
    !loading && !disabled
      ? getColorClasses({
          light: 'group-hover:[&>*]:stroke-secondary-light',
          dark: 'group-hover:[&>*]:stroke-white',
        })
      : '';

  return `${iconStrokeStyle} ${hoverStyle}`;
}
