import React from 'react';
import { IProfileWidgetCard } from './profile-widget-card';
export interface IProfileCardModProps extends IProfileWidgetCard {
  canUserEdit?: boolean;
  onChangeProfileData: (newProfileData: any) => void;
  editProfileLabel?: string;
  changeCoverImageLabel: string;
  onEntryFlag: () => void;
  getProfileProvidersData: () => void;
}
declare const ProfileCardMod: React.FC<IProfileCardModProps>;
export default ProfileCardMod;
