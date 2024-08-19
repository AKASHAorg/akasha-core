import { useState } from 'react';
import { saveAndGetImageObj } from './save-and-get-image-obj';
import { ExtensionImageType, Image } from '@akashaorg/typings/lib/ui';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

interface ISaveImage {
  type: ExtensionImageType;
  image?: File;
  onError?: (error: Error) => void;
}

export function useSaveImage() {
  const [loading, setLoading] = useState(false);
  const [logoImage, setLogoImage] = useState<Image | null>(null);
  const [coverImage, setCoverImage] = useState<Image | null>(null);
  const { logger } = useRootComponentProps();

  const saveImage = async ({ type, image, onError }: ISaveImage) => {
    try {
      setLoading(true);
      switch (type) {
        case 'logo-image':
          setLogoImage(await saveAndGetImageObj('avatar', image));
          break;
        case 'cover-image':
          setCoverImage(await saveAndGetImageObj('coverImage', image));
          break;
      }
    } catch (error) {
      onError(error);
      logger.error(`error while saving extension image: ${JSON.stringify(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return { logoImage, coverImage, loading, saveImage };
}
