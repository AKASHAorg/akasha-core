import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import { Icon } from '../../Icon';
import { IconType } from '../../Icon/icon';
import { StyledText, StyledTextIcon } from './styled-text-icon';

export interface ITextIconProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  color?: string;
  spacing?: string;
  label?: string;
  iconType: IconType;
  bold?: boolean;
  clickable?: boolean;
  menuActive?: boolean;
  menuIcon?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  primaryColor?: boolean;
  reverse?: boolean;
}

export interface IStyledTextProps {
  bold?: boolean;
}

const TextIcon: React.FC<ITextIconProps> = props => {
  const {
    className,
    onClick,
    margin,
    backgroundColor,
    color,
    iconType,
    label,
    spacing,
    bold,
    clickable,
    menuActive,
    menuIcon,
    size,
    primaryColor,
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
    >
      {!reverse && <Icon type={iconType} color={color} size={size} primaryColor={primaryColor} />}
      <StyledText bold={bold}>{label}</StyledText>
      {reverse && <Icon type={iconType} color={color} size={size} primaryColor={primaryColor} />}
    </StyledTextIcon>
  );
};

export default TextIcon;
