import * as React from 'react';
export interface ICardHeaderMenuProps {
  target: {};
  onMenuClose: () => void;
  flagAsLabel?: string;
  onFlag: () => void;
}
declare const CardHeaderMenuDropdown: React.FC<ICardHeaderMenuProps>;
export default CardHeaderMenuDropdown;
