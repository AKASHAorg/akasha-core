import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionReviewAndPublish from '@akashaorg/design-system-components/lib/components/ExtensionReviewAndPublish';
import { useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/typings/lib/ui';
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

  return (
    <Stack spacing="gap-y-4">
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Edit Extension Presentation')}
        </Text>
      </Stack>
      <ExtensionReviewAndPublish
        extensionData={extensionData}
        onClickBack={() => {
          navigate({
            to: routes[MY_EXTENSIONS],
          });
        }}
        onClickPublish={() => {
          navigate({
            to: '/submit-extension/$extensionId/step2',
          });
        }}
      />
    </Stack>
  );
};
