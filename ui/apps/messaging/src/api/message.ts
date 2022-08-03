import getSDK from '@akashaorg/awf-sdk';

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
