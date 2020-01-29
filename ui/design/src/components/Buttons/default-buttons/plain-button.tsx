import * as React from 'react';
import { StyledPlainButton, StyledText } from './styled-plain-button';

export interface IPlainButtonProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  label: string | number;
  children: React.ReactNode;
}

const PlainButton = (props: IPlainButtonProps) => {
  return (
    <StyledPlainButton className={props.className} gap="xsmall" direction="row" align="center">
      {props.children}
      <StyledText onClick={props.onClick}>{props.label}</StyledText>
    </StyledPlainButton>
  );
};

export default PlainButton;
