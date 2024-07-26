import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ExtensionEditStep1Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep1Form';
import { useSaveImage } from '../../../utils/use-save-image';
import {
  transformSource,
  hasOwn,
  useRootComponentProps,
  useAkashaStore,
} from '@akashaorg/ui-awf-hooks';
import { NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useAtom } from 'jotai';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AtomContext, FormData } from './main-page';

type ExtensionEditStep1PageProps = {
  extensionId: string;
};

export const ExtensionEditStep1Page: React.FC<ExtensionEditStep1PageProps> = ({ extensionId }) => {
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

  const initialExtensionData = useMemo(() => {
    return {
      name: appData?.name,
      displayName: appData?.displayName,
      logoImage: appData?.logoImage,
      coverImage: appData?.coverImage,
    };
  }, [appData]);

  const { logoImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = formValue.lastCompletedStep > 0 ? formValue : initialExtensionData;

  const onSaveImageError = () => {
    uiEvents.next({
      event: NotificationEvents.ShowNotification,
      data: {
        type: NotificationTypes.Error,
        title: t("The image wasn't uploaded correctly. Please try again!"),
      },
    });
  };

  return (
    <Stack spacing="gap-y-4">
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Edit Extension Presentation')}
        </Text>
      </Stack>
      <Stack align="center" justify="center">
        {loading && <Spinner />}
      </Stack>
      {!loading && (
        <ExtensionEditStep1Form
          extensionIdLabel={t('Extension Id')}
          extensionDisplayNameLabel={t('Extension Display Name')}
          defaultValues={defaultValues}
          extensionType={appData?.applicationType}
          header={{
            coverImage: coverImage,
            logoImage: logoImage,
            dragToRepositionLabel: t('Drag the image to reposition'),
            cancelLabel: t('Cancel'),
            deleteLabel: t('Delete'),
            saveLabel: t('Save'),
            imageTitle: {
              logoImage: { label: t('Edit Logo Image') },
              coverImage: { label: t('Edit Cover Image') },
            },
            deleteTitle: {
              logoImage: { label: t('Delete Logo Image') },
              coverImage: { label: t('Delete Cover Image') },
            },
            confirmationLabel: {
              logoImage: t(`Are you sure you want to delete the extension's logo image?`),
              coverImage: t(`Are you sure you want to delete the extension's cover image?`),
            },
            isSavingImage,
            publicImagePath: '/images',
            onImageSave: (type, image) => saveImage({ type, image, onError: onSaveImageError }),
            onImageDelete: () => {},
            transformSource,
          }}
          errorMessage={errorMessage}
          cancelButton={{
            label: t('Cancel'),
            disabled: false,
            handleClick: () => {
              navigate({
                to: routes[MY_EXTENSIONS],
              });
            },
          }}
          nextButton={{
            label: t('Next'),

            handleClick: data => {
              //reset the previous error message
              setErrorMessage(null);
              const step1Data = { ...data, logoImage, coverImage };
              setForm(prev => {
                return { ...prev, ...step1Data, lastCompletedStep: 1 };
              });
              navigate({
                to: '/edit-extension/$extensionId/step2',
              });
            },
          }}
        />
      )}
    </Stack>
  );
};
