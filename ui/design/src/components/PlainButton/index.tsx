import * as React from 'react';
import { StyledPlainButton, StyledText } from './styled-plain-button';

export interface IPlainButtonProps {
  className?: string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
  label: string | number;
  children: React.ReactNode;
  color?: string;
  disabled?: boolean;
}

const PlainButton = React.forwardRef(
  (props: IPlainButtonProps, ref?: React.Ref<HTMLDivElement>) => {
    return (
      <StyledPlainButton
        className={props.className}
        color={props.color}
        gap="xsmall"
        direction="row"
        align="center"
        style={{ userSelect: 'none' }}
        ref={ref}
        disabled={props.disabled}
      >
        {props.children}
        <StyledText onClick={props.onClick}>{props.label}</StyledText>
      </StyledPlainButton>
    );
  },
);

export default PlainButton;
