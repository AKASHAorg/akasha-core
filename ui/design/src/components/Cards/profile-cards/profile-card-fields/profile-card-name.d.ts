import * as React from 'react';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
export interface IProfileCardNameProps {
  editable: boolean;
  name?: string;
  nameIcon?: LogoSourceType;
  namePopoverOpen: boolean;
  setNamePopoverOpen: (value: boolean) => void;
  handleChangeName: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
}
declare const ProfileCardName: React.FC<IProfileCardNameProps>;
export default ProfileCardName;
