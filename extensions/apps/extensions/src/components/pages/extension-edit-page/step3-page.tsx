import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ExtensionEditStep3Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep3Form';
import { useSaveImage } from '../../../utils/use-save-image';
import { hasOwn, useRootComponentProps, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { useAtom } from 'jotai';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AtomContext, FormData } from './main-page';

type ExtensionEditStep3PageProps = {
  extensionId: string;
};

export const ExtensionEditStep3Page: React.FC<ExtensionEditStep3PageProps> = ({ extensionId }) => {
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
      extensionType: appData?.applicationType,
      extensionID: appData?.name,
      extensionName: appData?.displayName,
      logoImage: appData?.logoImage,
      coverImage: appData?.coverImage,
    };
  }, [appData]);

  const { logoImage, coverImage, saveImage, loading: isSavingImage } = useSaveImage();

  const [formValue, setForm] = useAtom<FormData>(useContext(AtomContext));

  const defaultValues = formValue.lastCompletedStep > 0 ? formValue : initialExtensionData;

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
        <ExtensionEditStep3Form
          defaultValues={defaultValues}
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
