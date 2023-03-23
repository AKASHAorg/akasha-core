export type SettingsOption =
  | 'Settings'
  | 'Privacy'
  | 'Theme'
  | 'General'
  | 'Apps'
  | 'Plugins'
  | 'Widgets';

export interface ISettingsItem {
  label: SettingsOption;
  clickable: boolean;
  isSubheading?: boolean;
}

export const settingsItems: ISettingsItem[] = [
  // {
  //   label: 'World',
  //   clickable: false,
  //   isSubheading: true,
  // },
  {
    label: 'Privacy',
    clickable: true,
  },
  {
    label: 'Theme',
    clickable: true,
  },
  // disable these untill they are used
  // {
  //   label: 'Integrations',
  //   clickable: false,
  //   isSubheading: true,
  // },
  // {
  //   label: 'General',
  //   clickable: false,
  // },
  // {
  //   label: 'Apps',
  //   clickable: true,
  // },
  // {
  //   label: 'Plugins',
  //   clickable: false,
  // },
  // {
  //   label: 'Widgets',
  //   clickable: false,
  // },
];
