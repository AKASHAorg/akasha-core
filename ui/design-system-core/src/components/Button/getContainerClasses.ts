import { getColorClasses } from '../../utils/getColorClasses';
import { getElevationClasses } from '../../utils/getElevationClasses';
import { ButtonProps } from './types';
interface IContainerClasses {
  greyBg: ButtonProps['greyBg'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
  hover: ButtonProps['hover'];
}

export function getContainerClasses({
  greyBg,
  variant,
  loading,
  disabled,
  active,
  hover,
}: IContainerClasses) {
  if (variant === 'primary') {
    return getPrimaryClasses({ greyBg, loading, disabled, active, hover });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled, active, hover });
  }

  return '';
}
interface IPrimaryClasses {
  greyBg: ButtonProps['greyBg'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
  hover: ButtonProps['hover'];
}

function getPrimaryClasses({ greyBg, loading, disabled, active, hover }: IPrimaryClasses) {
  let backgroundStyle = `bg-gradient-to-r from-primaryStart to-primaryStop`;
  const hoverStyle = !loading && !disabled && hover ? `hover:${getElevationClasses('4')}` : '';
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
  hover: ButtonProps['hover'];
}

function getSecondaryClasses({ loading, disabled, active, hover }: ISecondaryClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'border',
  );
  const hoverStyle =
    !loading && !disabled && hover
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
