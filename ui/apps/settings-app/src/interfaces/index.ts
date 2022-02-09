export type SettingsOption =
  | 'Settings'
  | 'Privacy'
  | 'Appearance'
  | 'General'
  | 'Apps'
  | 'Plugins'
  | 'Widgets';

export interface ISettingsItem {
  label: string;
  clickable: boolean;
  isSubheading?: boolean;
}

interface BaseOption {
  titleLabel: string;
  OnChevronLeftClick: () => void;
}
export interface IPrivacyOption extends BaseOption {
  essentialCookiesLabel: string;
  essentialCookiesInfo: string;
  trackingAnalyticsLabel: string;
  trackingAnalyticsInfoIntro: string;
  trackingAnalyticsInfo: string;
  privacyPolicyLabel: string;
  checkedTracking: boolean;
  cookieType: string;
  onTrackingOptionChange: (ev: React.SyntheticEvent) => void;
}

export interface IAppsOption extends BaseOption {
  autoUpdatesLabel: string;
  autoUpdatesInfo: string;
  dataAnalyticsLabel: string;
  dataAnalyticsinfo: string;
  checkedAutoUpdates: boolean;
  checkedDataAnalytics: boolean;
  onAutoUpdatesChange: (ev: React.SyntheticEvent) => void;
  onDataAnalyticsChange: (ev: React.SyntheticEvent) => void;
}

export interface IAppearanceOption extends BaseOption {
  appThemeLabel: string;
  appThemeInfo: string;
  theme: string;
  onThemeSelect: (ev: React.SyntheticEvent) => void;
}
