import { getColorClasses } from '../../utils/getColorClasses';
import { getElevationClasses } from '../../utils/getElevationClasses';
import { ButtonProps } from './types';

interface IContainerClasses {
  greyBg: ButtonProps['greyBg'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
}

export function getContainerClasses({
  greyBg,
  variant,
  loading,
  disabled,
  active,
}: IContainerClasses) {
  if (variant === 'primary') {
    return getPrimaryClasses({ greyBg, loading, disabled, active });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled, active });
  }

  return '';
}

interface IPrimaryClasses {
  greyBg: ButtonProps['greyBg'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
}

function getPrimaryClasses({ greyBg, loading, disabled, active }: IPrimaryClasses) {
  let backgroundStyle = `bg-gradient-to-r from-primaryStart to-primaryStop`;
  const hoverStyle = !loading && !disabled ? `hover:${getElevationClasses('4')}` : '';
  const activeStyle = !loading && !disabled && active ? `${getElevationClasses('4')}` : '';

  if (greyBg) {
    backgroundStyle = getColorClasses(
      {
        light: 'grey9',
        dark: 'grey3',
      },
      'bg',
    );
  }

  return `${disabled ? 'opacity-50' : ''} ${backgroundStyle} ${hoverStyle} ${activeStyle}`;
}

interface ISecondaryClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
}

function getSecondaryClasses({ loading, disabled, active }: ISecondaryClasses) {
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
  const activeStyle =
    !loading && !disabled && active
      ? `${getColorClasses(
          {
            light: 'secondaryLight/30',
            dark: 'secondaryDark',
          },
          'bg',
        )}`
      : '';

  return `${
    disabled ? 'opacity-50' : ''
  }border ${backgroundStyle} ${hoverStyle} ${activeStyle} ${borderStyle}`;
}
