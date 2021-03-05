import * as React from 'react';
export interface IAppsWidgetCardProps {
  className?: string;
  appInfo: IAppInfo;
  versionLabel: string;
  statusLabel: string;
  lastUpdateLabel: string;
  submittedLabel: string;
  adminLabel: string;
  categoryLabel: string;
  receiveUpdatesLabel: string;
  subscribeLabel: string;
  unsubscribeLabel: string;
  reportLabel: string;
  handleSubscribe: () => void;
  handleRecommend?: () => void;
  handleReport?: () => void;
}
export interface IAppInfo {
  name: string;
  version: string;
  status: string;
  lastUpdateDate: string;
  registryDate: string;
  admin: string;
  category: string;
}
declare const AppInfoWidgetCard: React.FC<IAppsWidgetCardProps>;
export default AppInfoWidgetCard;
