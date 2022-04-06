import { Observable } from 'rxjs';

export interface AWF_IENS {
  registerName(name: string): Observable<unknown>;

  claimName(name: string): Observable<unknown>;

  userIsOwnerOf(name: string): Promise<unknown>;

  isAvailable(name: string): Promise<unknown>;

  resolveAddress(ethAddress: string): Promise<unknown>;

  resolveName(name: string): Promise<unknown>;
}

export interface AWF_IIC_REGISTRY {
  getIntegrationInfo(integrationId: string): Promise<unknown>;

  getIntegrationReleaseInfo(releaseId: string): Promise<unknown>;

  getIntegrationsCount(): Promise<unknown>;

  getAllIntegrationsIds(offset: number): Promise<unknown>;

  getAllIntegrationReleaseIds(integrationName: string, offset: number): Promise<unknown>;

  getIntegrationId(name: string): Promise<unknown>;

  getIntegrationReleaseId(name: string, version: string): Promise<unknown>;

  getLatestReleaseInfo(opt: unknown): Observable<unknown>;

  getIntegrationsInfo(opt: unknown): Observable<unknown>;
}

export interface AWF_APP_BUILD_MANIFEST {
  links?: {
    publicRepository?: string;
    documentation?: string;
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
