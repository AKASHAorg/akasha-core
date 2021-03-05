import * as React from 'react';
export interface IMobileListModal {
  className?: string;
  cancelLabel?: string;
  closeModal: () => void;
  menuItems: IMenuItem[];
}
interface IMenuItem {
  label?: string;
  icon?: string;
  handler?: (arg1?: any) => void;
}
declare const MobileListModal: React.FC<IMobileListModal>;
export { MobileListModal };
