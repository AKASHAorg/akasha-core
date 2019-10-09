import { Button, ButtonProps } from 'grommet';
import React from 'react';

export interface IButtonProps extends ButtonProps {}

const AkashaButton: React.FunctionComponent<IButtonProps> = props => {
  return <Button {...props} />;
};

export default AkashaButton;
