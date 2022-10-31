import getSDK from '@akashaorg/awf-sdk';
import { lastValueFrom } from 'rxjs';

export const appId = '0xa9441406239791b073bea64df44bb32b2f15e6bae637847274b052e9b0bbdbbc';
export const serializeMessage = content => {
  try {
    const stringifyContent = JSON.stringify(content);
    const encoder = new TextEncoder();
    return encoder.encode(stringifyContent);
  } catch (e) {
    return undefined;
  }
};

export const sendMessage = async (to: string, body: unknown) => {
  const sdk = getSDK();
  const serializedContent = {
    content: body,
    meta: {
      integrationId: appId,
    },
  };
  const message = await sdk.api.auth.sendMessage(to, serializedContent);
  return {
    id: message.id,
    from: message.from,
    to: message.to,
    createdAt: message.createdAt,
    body: body,
  };
};

export const getMessages = async () => {
  const sdk = getSDK();
  return sdk.api.auth.getConversation(null);
};

export const getTextileUsage = async () => {
  const sdk = getSDK();
  return sdk.api.auth.getTextileUsage();
};

export const markAsRead = async (messageIds: string[]) => {
  const sdk = getSDK();
  messageIds.forEach(id => sdk.api.auth.markMessageAsRead(id));
};

export const getHubUser = async () => {
  const sdk = getSDK();
  const session = await lastValueFrom(sdk.api.auth.getSession());
  return session.data.user;
};
