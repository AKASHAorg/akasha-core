import getSDK from '@akashaorg/awf-sdk';

export const saveMediaFile = async ({
  isUrl,
  content,
  name,
  email,
}: {
  isUrl: boolean;
  content: Buffer | ArrayBuffer | File;
  name: string;
  email: `${string}@${string}`;
}) => {
  const sdk = getSDK();
  try {
    return await sdk.api.profile.saveMediaFile({ isUrl, content, name, email });
  } catch (error) {
    console.log('useProfile.saveFile', error);
    throw error;
  }
};
