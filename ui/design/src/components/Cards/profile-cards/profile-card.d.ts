import React from 'react';
import { IProfileWidgetCard } from './profile-widget-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
export interface IProfileProvidersData {
  currentProviders: {
    avatar?: IProfileDataProvider;
    coverImage?: IProfileDataProvider;
    name?: IProfileDataProvider;
    description?: IProfileDataProvider;
  };
  avatarProviders?: IProfileDataProvider[];
  coverImageProviders?: IProfileDataProvider[];
  userNameProviders?: IProfileDataProvider[];
  nameProviders?: IProfileDataProvider[];
  descriptionProviders?: IProfileDataProvider[];
}
export interface IProfileDataProvider {
  providerName: string;
  providerIcon?: LogoSourceType;
  value: string;
}
export interface IProfileCardProps extends IProfileWidgetCard {
  profileProvidersData?: IProfileProvidersData;
  canUserEdit?: boolean;
  onChangeProfileData?: (newProfileData: any) => void;
  editProfileLabel?: string;
  changeCoverImageLabel?: string;
  cancelLabel?: string;
  saveChangesLabel?: string;
  flagAsLabel?: string;
  flaggable: boolean;
  onEntryFlag: () => void;
  getProfileProvidersData?: () => void;
  onUpdateClick: () => void;
  onENSChangeClick: () => void;
  handleShareClick: () => void;
  updateProfileLabel?: string;
  changeENSLabel?: string;
  hideENSButton?: boolean;
}
declare const ProfileCard: React.FC<IProfileCardProps>;
export default ProfileCard;
