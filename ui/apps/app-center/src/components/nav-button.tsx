import * as React from 'react';
import { useRouteMatch } from 'react-router-dom';
import DS from '@akashaproject/design-system';

const { TabButton } = DS;

export interface NavButton {
  path: string;
  label: string;
  icon: any;
  onClick: () => void;
}

const NavButton: React.FC<NavButton> = props => {
  const { path, label, icon, onClick } = props;
  const match = useRouteMatch({ path, exact: true });
  return <TabButton active={!!match} label={label} onClick={onClick} iconType={icon} />;
};

export default NavButton;
