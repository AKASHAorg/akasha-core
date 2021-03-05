import React from 'react';
export interface IImagePopover {
  dropzoneLabel?: string;
  uploadImageLabel?: string;
  uploadingImageLabel?: string;
  byUrlLabel?: string;
  insertLabel?: string;
  uploadFailedLabel?: string;
  fetchImageFailedLabel?: string;
  target: HTMLElement;
  closePopover: () => void;
  insertImage: (data: {
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  }) => void;
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
}
declare const ImagePopover: React.FC<IImagePopover>;
export { ImagePopover };
