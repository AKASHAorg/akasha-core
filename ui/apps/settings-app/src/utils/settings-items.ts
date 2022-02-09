import { ISettingsItem } from '../interfaces';

export const settingsItems: ISettingsItem[] = [
  {
    label: 'World',
    clickable: false,
    isSubheading: true,
  },
  {
    label: 'Privacy',
    clickable: true,
  },
  {
    label: 'Appearance',
    clickable: true,
  },
  {
    label: 'Integrations',
    clickable: false,
    isSubheading: true,
  },
  {
    label: 'General',
    clickable: false,
  },
  {
    label: 'Apps',
    clickable: true,
  },
  {
    label: 'Plugins',
    clickable: false,
  },
  {
    label: 'Widgets',
    clickable: false,
  },
];
