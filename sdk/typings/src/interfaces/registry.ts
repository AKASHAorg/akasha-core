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
}
