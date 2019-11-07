import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Icon } from '../Icon';
import { IconType } from '../Icon/icon';
import { StyledText, StyledTextIcon } from './styled-text-icon';

export interface ITextIconProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  color?: string;
  spacing?: string;
  label: string;
  iconType: IconType;
  bold?: boolean;
  clickable?: boolean;
  actionType?: IActionType;
  menuActive?: boolean;
  menuIcon?: boolean;
}

export type IActionType = 'Assign Tokens' | 'Create a new vote' | 'Check finance';

export interface IStyledTextProps {
  bold?: boolean;
}

const actionTypeIcons: {
  'Assign Tokens': IconType;
  'Create a new vote': IconType;
  'Check finance': IconType;
} = {
  'Assign Tokens': 'person',
  'Create a new vote': 'thumbsUpGrey',
  'Check finance': 'app',
};

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
    actionType,
    menuActive,
    menuIcon,
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
      {actionType ? (
        <Icon type={actionTypeIcons[actionType]} color={color} />
      ) : (
        <Icon type={iconType} color={color} />
      )}

      <StyledText bold={bold}>{label}</StyledText>
    </StyledTextIcon>
  );
};

export default TextIcon;
