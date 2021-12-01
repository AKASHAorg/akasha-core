import { CheckBoxProps } from 'grommet';
import React from 'react';
import StyledCheckBox from './styled-checkbox';

export interface CheckboxPropsExtended extends CheckBoxProps {
  setChecked: () => void;
}

const Checkbox = (props: CheckboxPropsExtended) => {
  const { checked, setChecked, label } = props;
  return <StyledCheckBox checked={checked} label={label} onChange={setChecked} />;
};

export default Checkbox;
