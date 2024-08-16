export type InstalledExtensionSchema = {
  id: string;
  version: string;
  appName: string;
  // users can enable/disable this app
  disabledByUser?: boolean;
  // did who installed this app
  installedByDid: string;
};

export default {
  name: 'installedExtensions',
};
