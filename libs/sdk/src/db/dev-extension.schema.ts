import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type DevExtensionSchema = {
  id: number;
  name: string;
  applicationType: AkashaAppApplicationType;
  source: string;
};

export default {
  name: 'devExtensions',
};
