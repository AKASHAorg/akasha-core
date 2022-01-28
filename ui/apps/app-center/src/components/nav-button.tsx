import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';

const { IconButton } = DS;

export interface NavButton {
  path: string;
  label: string;
  icon: React.ReactElement<any>;
  onClick: () => void;
}

const NavButton: React.FC<NavButton> = props => {
  const { path, label, icon, onClick } = props;
  const match = useRouteMatch({ path, exact: true });
  return <IconButton primary={!!match} label={label} onClick={onClick} icon={icon} />;
};

export default NavButton;
