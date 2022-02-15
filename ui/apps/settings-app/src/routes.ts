export const HOME = 'Home';
export const PRIVACY = 'Privacy';
export const APPEARANCE = 'Appearance';
export const GENERAL = 'General';
export const APPS = 'Apps';
export const PLUGINS = 'Plugins';
export const WIDGETS = 'Widgets';
export const rootRoute = '/settings';

export default {
  [HOME]: `${rootRoute}`,
  [PRIVACY]: `${rootRoute}/privacy`,
  [APPEARANCE]: `${rootRoute}/appearance`,
  [APPS]: `${rootRoute}/apps`,
};
