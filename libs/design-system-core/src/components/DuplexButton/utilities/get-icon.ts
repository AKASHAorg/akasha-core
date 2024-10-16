import { ReactElement } from 'react';

interface IGetIcon {
  active: boolean;
  hovered: boolean;
  icon: ReactElement;
  activeHoverIcon: ReactElement;
  activeIcon: ReactElement;
}

export const getIcon = ({ active, hovered, icon, activeHoverIcon, activeIcon }: IGetIcon) => {
  //determine the icon to use based on the active and hovered states
  if (active) return hovered ? activeHoverIcon : activeIcon;
  return icon;
};
