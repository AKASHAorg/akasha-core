export interface SettingsSchema {
  serviceName: string;
  options: [[string, string | number | boolean]];
  id?: number;
}

export default {
  name: 'settings',
};
