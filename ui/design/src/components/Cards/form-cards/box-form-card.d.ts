import * as React from 'react';
export interface IBoxFormCardProps {
  className?: string;
  titleLabel?: string;
  avatarLabel?: string;
  coverImageLabel?: string;
  nameLabel?: string;
  descriptionLabel?: string;
  cancelLabel?: string;
  saveLabel?: string;
  uploadLabel?: string;
  urlLabel?: string;
  deleteLabel?: string;
  nameFieldPlaceholder: string;
  descriptionFieldPlaceholder: string;
  ethAddress: string;
  providerData: IBoxData;
  onSave: (data: any) => void;
  onCancel?: () => void;
  updateStatus: any;
}
export interface IImageSrc {
  src: string | null;
  prefix: string | null;
  preview?: string;
  isUrl: boolean;
}
export interface IBoxData {
  avatar?: string | IImageSrc;
  coverImage?: string | IImageSrc;
  name?: string;
  description?: string;
}
export interface IFormValues {
  avatar?: IImageSrc | null;
  coverImage?: IImageSrc | null;
  name?: string;
  description?: string;
}
declare const BoxFormCard: React.FC<IBoxFormCardProps>;
export default BoxFormCard;
