import { getColorClasses } from '../../utils/getColorClasses';
import { ButtonProps } from './types';

interface ITextClasses {
  variant: ButtonProps['variant'];
  loading: ButtonProps['loading'];
  disabled: ButtonProps['disabled'];
  hover: ButtonProps['hover'];
}

export function getTextClasses({ variant, loading, disabled, hover }: ITextClasses) {
  if (variant === 'text') {
    const textColorStyle = getColorClasses(
      {
        light: 'secondaryLight',
        dark: 'secondaryDark',
      },
      'text',
    );
    const hoverStyle =
      !loading && !disabled && hover
        ? getColorClasses(
            {
              light: 'secondaryDark',
              dark: 'white',
            },
            'group-hover:text',
          )
        : '';

    return `${disabled ? 'opacity-50' : ''} ${textColorStyle} ${hoverStyle}`;
  }

  if (variant === 'primary') {
    return 'text-white';
  }

  if (variant === 'secondary') {
    const textColorStyle = getColorClasses(
      {
        light: 'secondaryLight',
        dark: 'secondaryDark',
      },
      'text',
    );
    const hoverStyle = !loading && !disabled ? 'dark:group-hover:text-white' : '';
    return `${textColorStyle} ${hoverStyle}`;
  }

  return '';
}
