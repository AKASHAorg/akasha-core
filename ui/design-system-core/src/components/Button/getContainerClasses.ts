import { getColorClasses } from '../../utils/getColorClasses';
import { getElevationClasses } from '../../utils/getElevationClasses';
import { ButtonProps } from './types';

interface IContainerClasses {
  greyBg: ButtonProps['greyBg'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

export function getContainerClasses({ greyBg, variant, loading, disabled }: IContainerClasses) {
  if (variant === 'primary') {
    return getPrimaryClasses({ greyBg, loading, disabled });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled });
  }

  return '';
}

interface IPrimaryClasses {
  greyBg: ButtonProps['greyBg'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getPrimaryClasses({ greyBg, loading, disabled }: IPrimaryClasses) {
  let backgroundStyle = `bg-gradient-to-r from-primaryStart to-primaryStop`;
  const hoverStyle = !loading && !disabled ? `hover:${getElevationClasses('4')}` : '';

  if (greyBg) {
    backgroundStyle = getColorClasses({
      light: 'bg-grey9',
      dark: 'bg-grey3',
    });
  }

  return `${disabled ? 'opacity-50' : ''} ${backgroundStyle} ${hoverStyle}`;
}

interface ISecondaryClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getSecondaryClasses({ loading, disabled }: ISecondaryClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = getColorClasses({
    light: 'border-secondary-light',
    dark: 'border-secondary-dark',
  });
  const hoverStyle =
    !loading && !disabled
      ? `${getColorClasses({
          light: 'hover:bg-secondary-light/30',
          dark: 'hover:bg-secondary-dark',
        })}`
      : '';

  return `${disabled ? 'opacity-50' : ''}border ${backgroundStyle} ${hoverStyle} ${borderStyle}`;
}
