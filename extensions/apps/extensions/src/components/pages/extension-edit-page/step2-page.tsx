import React, { useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Spinner from '@akashaorg/design-system-core/lib/components/Spinner';
import ExtensionEditStep2Form from '@akashaorg/design-system-components/lib/components/ExtensionEditStep2Form';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { useAtom } from 'jotai';
import { useGetAppsByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { AtomContext, FormData } from './main-page';

type ExtensionEditStep2PageProps = {
  extensionId: string;
};

export const ExtensionEditStep2Page: React.FC<ExtensionEditStep2PageProps> = ({ extensionId }) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

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
              const step1Data = { ...data };
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
