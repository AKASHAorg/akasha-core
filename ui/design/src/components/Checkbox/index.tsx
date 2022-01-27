import { CheckBoxExtendedProps } from 'grommet';
import React from 'react';
import StyledCheckBox from './styled-checkbox';

export interface CheckBoxProps extends CheckBoxExtendedProps {
  ref?: React.Ref<HTMLInputElement>;
}

const Checkbox: React.FC<CheckBoxProps> = props => {
  return <StyledCheckBox {...props} />;
};

export default Checkbox;
