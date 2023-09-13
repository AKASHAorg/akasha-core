import { ReleaseInfo } from '@akashaorg/typings/lib/sdk';

export interface IntegrationSchema {
  name: string;
  id?: string;
  integrationType: number;
  version: string;
  sources: ReleaseInfo['sources'];
  status: boolean;
  config?: string[][];
}

export default {
  name: 'integrations',
};
