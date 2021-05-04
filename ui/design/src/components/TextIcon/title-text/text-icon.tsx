import * as React from 'react';
import MarginInterface from '../../../interfaces/margin.interface';
import Icon, { IconType } from '../../Icon';
import { StyledIconDiv, StyledText, StyledTextIcon } from './styled-text-icon';
import { TextProps } from 'grommet';

export interface ITextIconProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  iconBackground?: boolean;
  color?: string;
  spacing?: string;
  label?: string;
  iconType: IconType;
  iconStyle?: React.CSSProperties;
  clickable?: boolean;
  menuActive?: boolean;
  menuIcon?: boolean;
  iconSize?: 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fontSize?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | string;
  fontWeight?: 'normal' | 'bold' | number;
  primaryColor?: boolean;
  accentColor?: boolean;
  reverse?: boolean;
  fadedText?: boolean;
  ref?: React.Ref<HTMLDivElement>;
  disabled?: boolean;
}

export interface IStyledTextProps extends TextProps {
  accentColor?: boolean;
  disabled?: boolean;
}

const TextIcon: React.FC<ITextIconProps> = React.forwardRef((props, ref) => {
  const {
    className,
    onClick,
    margin,
    backgroundColor,
    iconBackground,
    color,
    iconType,
    iconStyle,
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
    fadedText,
    disabled,
  } = props;

  const renderIcon = () => {
    if (iconBackground) {
      return (
        <StyledIconDiv size={iconSize}>
          <Icon
            type={iconType}
            color={color}
            size={iconSize}
            style={iconStyle}
            primaryColor={primaryColor}
            accentColor={accentColor}
            disabled={disabled}
          />
        </StyledIconDiv>
      );
    }
    return (
      <Icon
        type={iconType}
        color={color}
        size={iconSize}
        style={iconStyle}
        primaryColor={primaryColor}
        accentColor={accentColor}
        disabled={disabled}
      />
    );
  };

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
      {!reverse && renderIcon()}
      <StyledText
        weight={fontWeight}
        size={fontSize}
        accentColor={accentColor}
        wordBreak="break-word"
        color={fadedText ? 'secondaryText' : 'primaryText'}
        disabled={disabled}
        truncate={true}
      >
        {label}
      </StyledText>
      {reverse && renderIcon()}
    </StyledTextIcon>
  );
});

export default TextIcon;
