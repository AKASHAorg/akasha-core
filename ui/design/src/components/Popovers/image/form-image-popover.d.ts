import * as React from 'react';
export interface IFormImagePopover {
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage?: (src: File | string, isUrl: boolean) => void;
  currentImage?: boolean;
  handleDeleteImage?: () => void;
}
declare const FormImagePopover: React.FC<IFormImagePopover>;
export { FormImagePopover };
