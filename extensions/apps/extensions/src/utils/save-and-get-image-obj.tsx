import { saveMediaFile } from '@akashaorg/ui-awf-hooks';

export const saveAndGetImageObj = async (name: 'avatar' | 'coverImage', content?: File) => {
  if (!content) return null;

  const mediaFile = await saveMediaFile({ name, isUrl: false, content });

  if (!mediaFile) return null;

  const mediaUri = `ipfs://${mediaFile.CID}`;

  return {
    height: mediaFile.size.height,
    width: mediaFile.size.width,
    src: mediaUri,
  };
};
