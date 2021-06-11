import { EthProviders } from './web3.connector';
import { InboxListOptions } from '@textile/hub';
import { Observable } from 'rxjs';

export interface IAWF_Auth {
  /**
   * Verifies if an ethereum address is already registered
   * Throws an UserNotRegistered error for addresses that are not registered
   * @param ethAddress
   */
  checkIfSignedUp(ethAddress: string): Observable<{ data: { errors?: never } }>;

  /**
   *
   * @param args
   */
  signIn(args: {
    provider?: EthProviders;
    checkRegistered: boolean;
  }): Promise<{ pubKey: string; ethAddress: string; isNewUser?: boolean } & { isNewUser: boolean }>;

  /**
   * Returns current session objects for textile
   */
  getSession(): Promise<{
    buck: any;
    identity: any;
    client: any;
    user: any;
    tokenGenerator: any;
  }>;

  /**
   * Generate a textile access token
   */
  getToken(): Promise<any>;

  /**
   * Returns the currently logged in user object
   * It will try to login if there is a previous session detected
   */
  getCurrentUser(): Promise<any>;

  /**
   * Destroy all the session objects
   */
  signOut(): Promise<boolean>;

  /**
   * Sign data with the identity key
   * @param data
   * @param base64Format
   */
  signData(
    data: Record<string, unknown> | string,
    base64Format,
  ): Promise<{ serializedData: any; signature: Uint8Array | string; pubKey: string }>;

  /**
   * Verify if a signature was made by a specific Public Key
   * @param args
   */
  verifySignature(args: {
    pubKey: string;
    data: Uint8Array | string | Record<string, unknown>;
    signature: Uint8Array | string;
  }): Promise<boolean>;

  /**
   * Allows decryption of privately sent messages to the current identity
   * @param message
   */
  decryptMessage(
    message,
  ): Promise<{ createdAt: any; from: any; id: any; body: string; readAt: any }>;

  /**
   * Returns all the inbox messages from Textile Users
   * @param args
   */
  getMessages(args: InboxListOptions): Promise<any[]>;

  /**
   * Checks the Textile Users inbox and looks for specific
   * notification message type
   */
  hasNewNotifications(): Promise<boolean>;

  /**
   *
   * @param messageId
   */
  markMessageAsRead(messageId: string): Promise<boolean>;

  /**
   *
   * @param messageId
   */
  deleteMessage(messageId: string): Promise<boolean>;

  /**
   *
   * @param inviteCode
   */
  validateInvite(inviteCode: string): Promise<boolean>;
}
