import { Observable } from 'rxjs';

export interface AWF_IENS {
  registerName(name: string): Observable<unknown>;

  claimName(name: string): Observable<unknown>;

  userIsOwnerOf(name: string): Promise<unknown>;

  isAvailable(name: string): Promise<unknown>;

  resolveAddress(ethAddress: string): Promise<unknown>;

  resolveName(name: string): Promise<unknown>;
}
