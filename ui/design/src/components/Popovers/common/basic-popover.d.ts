import * as React from 'react';
export interface IBasicPopover {
  className?: string;
  children: any;
  closePopover: () => void;
  target: React.RefObject<any>;
  gap?: string;
}
declare const BasicPopover: React.FC<IBasicPopover>;
export default BasicPopover;
