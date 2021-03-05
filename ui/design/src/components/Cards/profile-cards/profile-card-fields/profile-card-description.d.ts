import * as React from 'react';
import { IProfileDataProvider, IProfileProvidersData } from '../profile-card';
import { LogoSourceType } from '@akashaproject/ui-awf-typings/lib/index';
export interface IProfileCardDescriptionProps {
  descriptionLabel: string;
  editable: boolean;
  description?: string;
  descriptionIcon?: LogoSourceType;
  descriptionPopoverOpen: boolean;
  setDescriptionPopoverOpen: (value: boolean) => void;
  handleChangeDescription: (provider: IProfileDataProvider) => void;
  profileProvidersData?: IProfileProvidersData;
}
declare const ProfileCardDescription: React.FC<IProfileCardDescriptionProps>;
export default ProfileCardDescription;
