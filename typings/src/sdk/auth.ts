import { EthProviders } from './index';
import { CurrentUser } from './common';
import { Observable } from 'rxjs';

/**
 * Auth API
 */

interface AWF_IAuth {
  /**
   * enable key sync between opened tabs
   */
  enableSync(): void;

  checkIfSignedUp(ethAddress: string): Observable<unknown>;

  signIn(args: {
    provider?: EthProviders;
    checkRegistered: boolean;
  }): Observable<{ data: CurrentUser & { isNewUser: boolean } }>;

  getSession(): Observable<{
    data: {
      buck: never;
      never: never;
      user: never;
    };
  }>;

  getToken(): Observable<{ data: string }>;

  getCurrentUser(): Observable<{ data: CurrentUser | null }>;

  signOut(): Observable<{ data: boolean }>;

  signData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
    base64Format?: boolean,
  ): Observable<{
    data: { serializedData: unknown; signature: Uint8Array | string; pubKey: string };
  }>;

  verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }): Observable<{ data: boolean }>;

  authenticateMutationData(
    data: Record<string, unknown> | string | Record<string, unknown>[],
  ): Observable<{ signedData: unknown; token: unknown }>;

  decryptMessage(message): Observable<{
    data: {
      body: Record<string, any>;
      from: string;
      readAt: number;
      createdAt: number;
      id: string;
    };
  }>;

  getMessages(args: never): Observable<{
    data: IMessage[];
  }>;

  hasNewNotifications(): Observable<{ data: boolean }>;

  markMessageAsRead(messageId: string): Observable<{ data: boolean }>;

  deleteMessage(messageId: string): Observable<{ data: boolean }>;

  validateInvite(inviteCode: string): Observable<{ data: boolean }>;
}

export interface IMessage {
  body: Record<string, any>;
  from: string;
  readAt: number;
  createdAt: number;
  id: string;
  read: boolean;
}

export default AWF_IAuth;
