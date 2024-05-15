export interface IntegrationSchema {
  name: string;
  id?: string;
  integrationType: number;
  version: string;
  sources: string[];
  status: boolean;
  config?: string[][];
}

export default {
  name: 'integrations',
};
