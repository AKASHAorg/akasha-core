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
  hoverColor: ButtonProps['hoverColor'];
}

export function getContainerClasses({
  greyBg,
  variant,
  loading,
  disabled,
  active,
  hover,
  hoverColor,
}: IContainerClasses) {
  if (variant === 'primary') {
    return getPrimaryClasses({ greyBg, loading, disabled, active, hover });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled, active, hover, hoverColor });
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
  return `${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } ${backgroundStyle} ${hoverStyle} ${activeStyle}`;
}
interface ISecondaryClasses {
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
  hover: ButtonProps['hover'];
  hoverColor: ButtonProps['hoverColor'];
}

function getSecondaryClasses({ loading, disabled, active, hover, hoverColor }: ISecondaryClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'border',
  );
  const hoverBorderColor = hoverColor?.border
    ? getColorClasses(
        hoverColor.border,

        'hover:border',
      )
    : '';
  const hoverBgColor = getColorClasses(
    hoverColor?.background
      ? hoverColor.background
      : {
          light: 'secondaryLight/30',
          dark: 'secondaryDark',
        },
    'hover:bg',
  );
  const hoverStyle = !loading && !disabled && hover ? `${hoverBgColor} ${hoverBorderColor}` : '';
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
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  }border ${backgroundStyle} ${hoverStyle} ${activeStyle} ${borderStyle}`;
}
