import { useState } from 'react';
import { saveAndGetImageObj } from './save-and-get-image-obj';
import { AkashaProfileImageVersions } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ProfileImageType } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

interface ISaveImage {
  type: ProfileImageType;
  image?: File;
  onError?: (error: Error) => void;
}

export function useSaveImage() {
  const [loading, setLoading] = useState(false);
  const [avatarImage, setAvatarImage] = useState<AkashaProfileImageVersions | null>(null);
  const [coverImage, setCoverImage] = useState<AkashaProfileImageVersions | null>(null);
  const { logger } = useRootComponentProps();

  const saveImage = async ({ type, image, onError }: ISaveImage) => {
    try {
      setLoading(true);
      switch (type) {
        case 'avatar':
          setAvatarImage(await saveAndGetImageObj('avatar', image));
          break;
        case 'cover-image':
          setCoverImage(await saveAndGetImageObj('coverImage', image));
          break;
      }
    } catch (error) {
      onError(error);
      logger.error(`error while saving profile image: ${JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return { avatarImage, coverImage, loading, saveImage };
}
