import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { Icon } from '../Icon';
import { IconType } from '../Icon/icon';
import { StyledText, StyledTextIcon } from './styled-text-icon';

export interface ITextIconProps {
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
  } = props;

  if (actionType) {
    return (
      <StyledTextIcon
        onClick={onClick}
        margin={margin}
        backgroundColor={backgroundColor}
        color={color}
        label={actionType}
        iconType={iconType}
        spacing={spacing}
        clickable={clickable}
      >
        <Icon type={actionTypeIcons[actionType]} color={color} />
        <StyledText bold={bold}>{actionType}</StyledText>
      </StyledTextIcon>
    );
  }

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
    >
      <Icon type={iconType} color={color} />
      <StyledText bold={bold}>{label}</StyledText>
    </StyledTextIcon>
  );
};

export default TextIcon;
