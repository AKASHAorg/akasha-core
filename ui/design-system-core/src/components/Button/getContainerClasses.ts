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
  if (variant === 'contained') {
    return getContainedClasses({ greyBg, loading, disabled });
  }

  if (variant === 'outlined') {
    return getOutlinedClasses({ loading, disabled });
  }

  return '';
}

interface IContainedClasses {
  greyBg: ButtonProps['greyBg'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getContainedClasses({ greyBg, loading, disabled }: IContainedClasses) {
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

interface IOutlinedClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getOutlinedClasses({ loading, disabled }: IOutlinedClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = getColorClasses({
    light: 'border-secondary-light',
    dark: 'border-secondary-dark',
  });
  const hoverStyle =
    !loading && !disabled
      ? `${getColorClasses({
          light: 'hover:bg-secondary-light',
          dark: 'hover:bg-secondary-dark',
        })}`
      : '';

  return `${disabled ? 'opacity-50' : ''} border ${backgroundStyle} ${hoverStyle} ${borderStyle}`;
}
