import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import { StyledTextIcon, StyledText } from './styled-text-icon';
import Icon, { IconType } from '../Icon';

export interface ITextIconProps {
  onClick: React.EventHandler<React.SyntheticEvent>;
  margin?: MarginInterface;
  backgroundColor?: string;
  color?: string;
  spacing?: string;
  text: string;
  iconType: IconType;
  bold?: boolean;
}

export interface IStyledTextProps {
  bold?: boolean;
}

const TextIcon: React.FC<ITextIconProps> = props => {
  const { onClick, margin, backgroundColor, color, iconType, text, spacing, bold } = props;

  return (
    <StyledTextIcon
      onClick={onClick}
      margin={margin}
      backgroundColor={backgroundColor}
      color={color}
      text={text}
      iconType={iconType}
      spacing={spacing}
      bold={bold}
    >
      <Icon type={iconType} color={color} />
      <StyledText>{text}</StyledText>
    </StyledTextIcon>
  );
};

export default TextIcon;
