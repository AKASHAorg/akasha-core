import * as React from 'react';
export interface IImageUpload {
  uploadFailedLabel?: string;
  uploadingImageLabel?: string;
  uploading: boolean;
  setUploading: any;
  uploadRequest?: (data: string | File, isUrl?: boolean) => any;
  handleInsertImage: (data: {
    src: string;
    size: {
      width: string;
      height: string;
      naturalWidth: string;
      naturalHeight: string;
    };
  }) => void;
  ref: React.Ref<HTMLInputElement>;
}
declare const ImageUpload: React.FC<IImageUpload>;
export { ImageUpload };
