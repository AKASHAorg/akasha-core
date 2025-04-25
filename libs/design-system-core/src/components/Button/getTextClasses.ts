import { ButtonProps } from './types';

import { getColorClasses } from '../../utils/get-color-classes';
interface ITextClasses {
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  hover: ButtonProps['hover'];
  hoverColors: ButtonProps['hoverColors'];
  active: ButtonProps['active'];
}

export function getTextClasses({
  variant,
  loading,
  disabled,
  hover,
  hoverColors,
  active,
}: ITextClasses) {
  if (variant === 'text') {
    const textColorStyle = 'text-secondaryLight dark:text-secondaryDark';
    const hoverStyle =
      !loading && !disabled && hover
        ? 'group-hover:text-secondaryDark dark:group-hover:text-white'
        : '';
    return `${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${textColorStyle} ${hoverStyle}`;
  }

  if (variant === 'primary') {
    return 'text-white';
  }

  if (variant === 'secondary') {
    const textColorStyle = `text-secondaryLight ${active ? 'dark:text-grey1' : 'dark:text-secondaryDark'}`;
    const hoverTextColor = hoverColors?.text
      ? getColorClasses(hoverColors.text, 'group-hover:text')
      : 'dark:group-hover:text-white';
    const hoverStyle = !loading && !disabled && hover ? hoverTextColor : '';
    return `${textColorStyle} ${hoverStyle}`;
  }

  return '';
}
