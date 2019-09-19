import { CheckBox, CheckBoxProps } from 'grommet';
import * as React from 'react';
import commonInterface from '../../interfaces/common.interface';

export interface ICheckBoxProps extends CheckBoxProps, commonInterface<any> {}

const SimpleCheckBox: React.FC<ICheckBoxProps> = props => {
  return <CheckBox {...props} />;
};

export default SimpleCheckBox;
