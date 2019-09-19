import { TextInput } from 'grommet';
import * as React from 'react';
import MarginInterface from '../../interfaces/margin.interface';
import Button from '../Button';
import { StyledIconContainer, StyledInput } from './styled-input';

export interface InputProps {
  value: string;
  placeholder: string;
  disabled?: boolean;
  icon?: any;
  withButton?: boolean;
  leftSideButton?: boolean;
  onChange: React.EventHandler<React.SyntheticEvent>;
  onButtonClick?: React.EventHandler<React.SyntheticEvent> | null;
  margin?: MarginInterface;
  backgroundColor?: string;
}

const Input: React.FC<InputProps> = (props: InputProps) => {
  const [focused, setFocus] = React.useState(false);

  const renderedButton = (
    <>
      {Boolean(props.icon) && (
        <>
          {props.withButton && (
            <Button
              buttonType="primary"
              disabled={props.disabled}
              onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                props.onButtonClick && props.onButtonClick(event);
              }}
            >
              {props.icon}
            </Button>
          )}

          {!props.withButton && <StyledIconContainer>{props.icon}</StyledIconContainer>}
        </>
      )}
    </>
  );

  return (
    <StyledInput
      disabled={props.disabled}
      focused={focused}
      withButton={props.withButton}
      margin={props.margin}
      backgroundColor={props.backgroundColor}
    >
      {props.leftSideButton && renderedButton}

      <TextInput
        plain={!props.withButton}
        value={props.value}
        placeholder={props.placeholder}
        disabled={props.disabled}
        onChange={props.onChange}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
      />

      {!props.leftSideButton && renderedButton}
    </StyledInput>
  );
};

Input.defaultProps = {
  disabled: false,
  icon: null,
  withButton: false,
  leftSideButton: false,
  onButtonClick: null,
};

export default Input;
