import * as React from 'react';
import StyledIconButton from './styled-icon-button';
interface IIconButtonProps {
  className?: string;
  icon: React.ReactElement;
  label: string;
  onClick?: () => void;
  primary?: boolean;
  share?: boolean;
}

const IconButton = (props: IIconButtonProps) => {
  return <StyledIconButton className={props.className} {...props} />;
};

export default IconButton;
