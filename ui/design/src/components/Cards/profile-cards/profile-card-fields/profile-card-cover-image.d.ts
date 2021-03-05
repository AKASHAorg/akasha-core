import * as React from 'react';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
export interface IProfileCardCoverImageProps {
  shareProfileLabel: string;
  changeCoverImageLabel?: string;
  editable: boolean;
  canUserEdit?: boolean;
  coverImage?: string;
  coverImageIcon?: LogoSourceType;
  handleChangeCoverImage: (provider: IProfileDataProvider) => void;
  coverImagePopoverOpen: boolean;
  setCoverImagePopoverOpen: (value: boolean) => void;
  handleShareClick: () => void;
  profileProvidersData?: IProfileProvidersData;
}
declare const ProfileCardCoverImage: React.FC<IProfileCardCoverImageProps>;
export default ProfileCardCoverImage;
