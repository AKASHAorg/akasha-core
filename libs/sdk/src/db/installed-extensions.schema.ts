import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type InstalledExtensionSchema = {
  releaseId: string;
  version: string;
  appName: string;
  source: string;
  applicationType: AkashaAppApplicationType;
  termsAccepted: boolean;
};

export default {
  name: 'installedExtensions',
};
