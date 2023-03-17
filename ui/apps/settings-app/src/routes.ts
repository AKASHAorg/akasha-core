export const HOME = 'Home';
export const PRIVACY = 'Privacy';
export const THEME = 'Theme';
export const GENERAL = 'General';
export const APPS = 'Apps';
export const PLUGINS = 'Plugins';
export const WIDGETS = 'Widgets';
export const rootRoute = '/settings';

export default {
  [HOME]: `${rootRoute}`,
  [PRIVACY]: `${rootRoute}/privacy`,
  [THEME]: `${rootRoute}/theme`,
  [APPS]: `${rootRoute}/apps`,
};
