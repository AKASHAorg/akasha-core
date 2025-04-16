import { getColorClasses } from '../../utils/get-color-classes';
import { ButtonProps } from './types';
interface IContainerClasses {
  greyBg: ButtonProps['greyBg'];
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  active: ButtonProps['active'];
  hover: ButtonProps['hover'];
  hoverColors: ButtonProps['hoverColors'];
}

export function getContainerClasses({
  greyBg,
  variant,
  loading,
  disabled,
  active,
  hover,
  hoverColors,
}: IContainerClasses) {
  if (variant === 'primary') {
    return getPrimaryClasses({ greyBg, loading, disabled, active, hover });
  }

  if (variant === 'secondary') {
    return getSecondaryClasses({ loading, disabled, active, hover, hoverColors });
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
  const hoverStyle =
    !loading && !disabled && hover ? `hover:shadow-[0_0_6px_rgba(186,154,224,0.8)]` : '';
  const activeStyle =
    !loading && !disabled && active ? `shadow-[0_0_6px_rgba(186,154,224,0.8)]` : '';

  if (greyBg) {
    backgroundStyle = 'bg-grey9 dark:bg-grey3';
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
  hoverColors: ButtonProps['hoverColors'];
}

function getSecondaryClasses({ loading, disabled, active, hover, hoverColors }: ISecondaryClasses) {
  const backgroundStyle = 'bg-transparent';
  const borderStyle = 'border-secondaryLight dark:border-secondaryDark';
  const hoverBorderColor = hoverColors?.border
    ? getColorClasses(
        hoverColors.border,

        'hover:border',
      )
    : '';
  const hoverBgColor = 'hover:bg:secondaryLight/30 dark:hover:bg-secondaryDark';
  const hoverStyle = !loading && !disabled && hover ? `${hoverBgColor} ${hoverBorderColor}` : '';
  const activeStyle =
    !loading && !disabled && active ? 'bg-secondaryLight/30 dark:bg-secondaryDark' : '';
  return `${
    disabled ? 'opacity-50 cursor-not-allowed' : ''
  } border ${backgroundStyle} ${hoverStyle} ${activeStyle} ${borderStyle}`;
}
