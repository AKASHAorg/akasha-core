import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { Icon } from '../../Icon';
import { IconType } from '../../Icon/icon';
import { StyledText, StyledTextIcon } from './styled-text-icon';
import { TextProps } from 'grommet';

export interface ITextIconProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  color?: string;
  spacing?: string;
  label?: string;
  iconType: IconType;
  clickable?: boolean;
  menuActive?: boolean;
  menuIcon?: boolean;
  iconSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | string;
  fontWeight?: 'normal' | 'bold' | number;
  primaryColor?: boolean;
  accentColor?: boolean;
  reverse?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export interface IStyledTextProps extends TextProps {
  accentColor?: boolean;
}

const TextIcon: React.FC<ITextIconProps> = React.forwardRef((props, ref) => {
  const {
    className,
    onClick,
    margin,
    backgroundColor,
    color,
    iconType,
    label,
    spacing,
    clickable,
    menuActive,
    menuIcon,
    iconSize,
    fontSize,
    fontWeight,
    primaryColor,
    accentColor,
    reverse,
  } = props;

  return (
    <StyledTextIcon
      onClick={onClick}
      margin={margin}
      backgroundColor={backgroundColor}
      color={color}
      label={label}
      iconType={iconType}
      spacing={spacing}
      clickable={clickable}
      className={className}
      menuActive={menuActive}
      menuIcon={menuIcon}
      ref={ref}
    >
      {!reverse && (
        <Icon
          type={iconType}
          color={color}
          size={iconSize}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}
      <StyledText
        weight={fontWeight}
        size={fontSize}
        accentColor={accentColor}
        wordBreak="break-word"
      >
        {label}
      </StyledText>
      {reverse && (
        <Icon
          type={iconType}
          color={color}
          size={iconSize}
          primaryColor={primaryColor}
          accentColor={accentColor}
        />
      )}
    </StyledTextIcon>
  );
});

export default TextIcon;
