import { RadioButton, RadioButtonProps } from 'grommet';
import React from 'react';
import CommonInterface from '../../interfaces/common.interface';

// tslint:disable-next-line:no-empty-interface
export interface IRadioButtonProps extends RadioButtonProps, CommonInterface<any> {}

const CustomRadioButton: React.FC<IRadioButtonProps> = props => {
  return <RadioButton {...props} />;
};

export default CustomRadioButton;
