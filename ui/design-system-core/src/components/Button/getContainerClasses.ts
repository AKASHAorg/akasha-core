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
    backgroundStyle = getColorClasses(
      {
        light: 'grey9',
        dark: 'grey3',
      },
      'bg',
    );
  }

  return `${disabled ? 'opacity-50' : ''} ${backgroundStyle} ${hoverStyle}`;
}

interface ISecondaryClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
}

function getSecondaryClasses({ loading, disabled }: ISecondaryClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'border',
  );
  const hoverStyle =
    !loading && !disabled
      ? `${getColorClasses(
          {
            light: 'secondaryLight/30',
            dark: 'secondaryDark',
          },
          'hover:bg',
        )}`
      : '';

  return `${disabled ? 'opacity-50' : ''}border ${backgroundStyle} ${hoverStyle} ${borderStyle}`;
}
