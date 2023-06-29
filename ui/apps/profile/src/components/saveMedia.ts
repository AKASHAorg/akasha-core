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
  email: string;
}) => {
  /*Check if @ symbol is somewhere besides the beginning of the string*/
  if (!email.indexOf('@')) return null;

  const sdk = getSDK();
  try {
    return await sdk.api.profile.saveMediaFile({
      isUrl,
      content,
      name,
      email: email as 'string@string',
    });
  } catch (error) {
    console.log('useProfile.saveFile', error);
    throw error;
  }
};
