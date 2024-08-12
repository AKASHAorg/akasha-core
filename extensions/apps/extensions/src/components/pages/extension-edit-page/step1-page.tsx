import React, { useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionEditStep1Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep1Form';
import { useSaveImage } from '../../../utils/use-save-image';
import { transformSource, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension, NotificationEvents, NotificationTypes } from '@akashaorg/typings/lib/ui';
import { useAtom } from 'jotai';
import { AtomContext, FormData } from './main-page';
import { DRAFT_EXTENSIONS } from '../../../constants';

type ExtensionEditStep1PageProps = {
  extensionId: string;
};

export const ExtensionEditStep1Page: React.FC<ExtensionEditStep1PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const { uiEvents } = useRootComponentProps();

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const draftExtensions: Extension[] = useMemo(
    () => JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [],
    [authenticatedDID],
  );

  const extensionData = draftExtensions.find(draftExtension => draftExtension.id === extensionId);

  const { logoImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = formValue.lastCompletedStep > 0 ? formValue : extensionData;

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
      <ExtensionEditStep1Form
        extensionIdLabel={t('Extension Id')}
        extensionDisplayNameLabel={t('Extension Display Name')}
        defaultValues={defaultValues}
        extensionType={extensionData?.applicationType}
        header={{
          coverImage: transformSource(coverImage || defaultValues?.coverImage),
          logoImage: transformSource(logoImage || defaultValues?.logoImage),
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
        }}
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
            const step1Data = {
              ...data,
              logoImage: logoImage || defaultValues.logoImage,
              coverImage: coverImage || defaultValues.coverImage,
            };
            setForm(prev => {
              return { ...prev, ...step1Data, lastCompletedStep: 1 };
            });
            navigate({
              to: '/edit-extension/$extensionId/step2',
            });
          },
        }}
      />
    </Stack>
  );
};
