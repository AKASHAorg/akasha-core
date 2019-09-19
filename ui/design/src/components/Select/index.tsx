import { Select, SelectProps } from 'grommet';
import React from 'react';
import CommonInterface from '../../interfaces/common.interface';

export interface ISelectProps extends SelectProps, CommonInterface<any> {}

const SimpleSelect: React.FunctionComponent<ISelectProps> = props => {
  return <Select {...props} />;
};

export default SimpleSelect;
