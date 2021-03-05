import * as React from 'react';
import { IProfileData } from '../profile-widget-card';
export interface IProfileCardEthereumIdProps {
  ethereumAddressLabel?: string;
  ethereumNameLabel?: string;
  copyLabel?: string;
  showQRCodeLabel?: string;
  profileData: IProfileData;
}
declare const ProfileCardEthereumId: React.FC<IProfileCardEthereumIdProps>;
export default ProfileCardEthereumId;
