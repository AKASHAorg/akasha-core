import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ExtensionEditStep2Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep2Form';
import {
  getMediaUrl,
  hasOwn,
  saveMediaFile,
  useAkashaStore,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useAtom } from 'jotai';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AtomContext, FormData } from './main-page';
import { GalleryImage, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';

type ExtensionEditStep2PageProps = {
  extensionId: string;
};

export const ExtensionEditStep2Page: React.FC<ExtensionEditStep2PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');
  const { uiEvents } = useRootComponentProps();

  const [errorMessage, setErrorMessage] = useState(null);

  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const {
    data: appsByIdReq,
    error,
    loading,
  } = useGetAppsByIdQuery({
    variables: {
      id: extensionId,
    },
    skip: !authenticatedProfile?.did.id,
  });

  const appData = useMemo(() => {
    return appsByIdReq?.node && hasOwn(appsByIdReq?.node, 'id') ? appsByIdReq?.node : null;
  }, [appsByIdReq]);

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = useMemo(() => {
    return formValue.lastCompletedStep > 1 ? formValue : appData;
  }, [appData]);

  const [uploading, setUploading] = useState(false);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);

  const onUpload = async (image: File | string, isUrl?: boolean) => {
    if (!image) return null;
    setUploading(true);

    const imageName = typeof image === 'string' ? image : image.name || 'extension-gallery-image';

    try {
      const mediaFile = await saveMediaFile({
        name: imageName,
        isUrl: isUrl || false,
        content: image,
      });
      setUploading(false);
      if (!mediaFile) return null;

      const mediaUri = `ipfs://${mediaFile.CID}`;

      const mediaUrl = getMediaUrl(mediaUri);

      const imageObj = {
        size: { height: mediaFile.size.height, width: mediaFile.size.width },
        displaySrc: mediaUrl.originLink || mediaUrl.fallbackLink,
        src: mediaUri,
        name: imageName,
        originalSrc: typeof image === 'string' ? image : URL.createObjectURL(image),
      };

      return imageObj;
    } catch (error) {
      setUploading(false);
      uiEvents.next({
        event: NotificationEvents.ShowNotification,
        data: {
          type: NotificationTypes.Error,
          title: t("The image wasn't uploaded correctly. Please try again!"),
        },
      });
      return null;
    }
  };

  const uploadNewImage = async (image: File | string, isUrl?: boolean) => {
    const uploadedImage = await onUpload(image, isUrl);
    setGalleryImages(prev => [
      ...prev,
      {
        name: uploadedImage?.name,
        src: uploadedImage?.src,
        displaySrc: uploadedImage?.displaySrc,
        originalSrc: uploadedImage?.originalSrc,
        size: uploadedImage?.size,
      },
    ]);
  };

  const handleDeleteImage = (element: GalleryImage) => {
    const newImages = galleryImages.filter(image => image.src !== element.src);
    setGalleryImages(newImages);
  };

  return (
    <Stack spacing="gap-y-4">
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Present your Extension')}
        </Text>
      </Stack>
      <Stack align="center" justify="center">
        {loading && <Spinner />}
      </Stack>
      {!loading && (
        <ExtensionEditStep2Form
          nsfwFieldLabel={t('Extension NSFW?')}
          nsfwDescriptionLabel={t('Once you mark it as NSFW, you can’t change it back')}
          descriptionFieldLabel={t('Description')}
          descriptionPlaceholderLabel={t('What does this extension do?')}
          galleryFieldLabel={t('Gallery')}
          galleryDescriptionLabel={t(
            'Having a gallery to show off the extension will increase installs',
          )}
          documentationFieldLabel={t('Documentation')}
          documentationDescriptionLabel={t('Add any documentation necessary to help others ')}
          linkTitleLabel={t('Link')}
          linkPlaceholderLabel={t('Link title')}
          addLabel={t('Add')}
          uploading={uploading}
          handleImageUpload={uploadNewImage}
          handleImageDelete={handleDeleteImage}
          images={galleryImages}
          defaultValues={defaultValues}
          errorMessage={errorMessage}
          cancelButton={{
            label: t('Back'),
            disabled: false,
            handleClick: () => {
              navigate({
                to: '/edit-extension/$extensionId/step1',
              });
            },
          }}
          nextButton={{
            label: t('Next'),

            handleClick: data => {
              //reset the previous error message
              setErrorMessage(null);
              const step1Data = {
                ...data,
                gallery: galleryImages?.map(galleryImage => {
                  return {
                    width: galleryImage.size?.width,
                    height: galleryImage.size?.height,
                    src: galleryImage.src,
                  };
                }),
              };
              setForm(prev => {
                return { ...prev, ...step1Data, lastCompletedStep: 2 };
              });
              navigate({
                to: '/edit-extension/$extensionId/step3',
              });
            },
          }}
        />
      )}
    </Stack>
  );
};
