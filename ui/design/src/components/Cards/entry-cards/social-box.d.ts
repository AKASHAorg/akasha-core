import * as React from 'react';
import { IProfileData } from '../profile-cards/profile-widget-card';
export declare type ISocialData = IProfileData[];
export interface ISocialBox {
  socialData: ISocialData;
  onClickUser?: (ethAddress: string) => void;
  repostedThisLabel?: string;
  andLabel?: string;
  othersLabel?: string;
}
declare const SocialBox: React.FC<ISocialBox>;
export { SocialBox };
