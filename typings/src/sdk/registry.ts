export interface AWF_APP_BUILD_MANIFEST {
  links?: {
    publicRepository?: string;
    documentation?: string;
    detailedDescription?: string;
  };
  sources: string[];
}

export interface AWF_APP_SOURCE_MANIFEST {
  mainFile: string;
  license?: string;
  description?: string;
  keywords?: string[];
  displayName?: string;
}

export interface ReleaseInfo {
  integrationID: string;
  id: string;
  name: string;
  version: string;
  integrationType: number;
  links?: AWF_APP_BUILD_MANIFEST['links'];
  sources: AWF_APP_BUILD_MANIFEST['sources'];
  author: string;
  enabled: boolean;
  manifestData?: AWF_APP_SOURCE_MANIFEST;
  createdAt?: number;
}

export interface IntegrationInfo {
  id: string;
  name: string;
  author: string;
  integrationType: number;
  latestReleaseId: string;
  enabled: boolean;
}
