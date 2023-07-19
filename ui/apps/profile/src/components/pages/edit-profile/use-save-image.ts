import { useState } from 'react';
import { saveAndGetImageObj } from './save-and-get-image-obj';
import { ProfileImageVersions } from '@akashaorg/typings/sdk/graphql-types-new';
import { ProfileImageType } from '@akashaorg/typings/ui';

export function useSaveImage() {
  const [loading, setLoading] = useState(false);
  const [avatarImage, setAvatarImage] = useState<ProfileImageVersions | null>(null);
  const [coverImage, setCoverImage] = useState<ProfileImageVersions | null>(null);

  const saveImage = async (type: ProfileImageType, image?: File) => {
    setLoading(true);
    switch (type) {
      case 'avatar':
        setAvatarImage(await saveAndGetImageObj('avatar', image));
        break;
      case 'cover-image':
        setCoverImage(await saveAndGetImageObj('coverImage', image));
        break;
    }
    setLoading(false);
  };

  return { avatarImage, coverImage, loading, saveImage };
}
