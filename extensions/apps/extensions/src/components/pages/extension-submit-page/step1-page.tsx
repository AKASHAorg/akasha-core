import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import routes, { MY_EXTENSIONS } from '../../../routes';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ExtensionReviewAndPublish from '@akashaorg/design-system-components/lib/components/ExtensionReviewAndPublish';
import { transformSource, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/typings/lib/ui';
import { CONTACT_INFO, DRAFT_EXTENSIONS } from '../../../constants';
import Stepper from '@akashaorg/design-system-core/lib/components/Stepper';

type ExtensionSubmitStep1PageProps = {
  extensionId: string;
};

export const ExtensionSubmitStep1Page: React.FC<ExtensionSubmitStep1PageProps> = ({
  extensionId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-extensions');

  const {
    data: { authenticatedDID },
  } = useAkashaStore();

  const draftExtensions: Extension[] = useMemo(
    () => JSON.parse(localStorage.getItem(`${DRAFT_EXTENSIONS}-${authenticatedDID}`)) || [],
    [authenticatedDID],
  );

  const extensionData = draftExtensions.find(draftExtension => draftExtension.id === extensionId);

  const extData = {
    ...extensionData,
    links: extensionData.links?.filter(link => link.label !== `${extensionId}-${CONTACT_INFO}`),
    contactInfo: extensionData.links?.find(link => link.label === `${extensionId}-${CONTACT_INFO}`)
      ?.href,
  };

  return (
    <Stack spacing="gap-y-2">
      <Stack padding={16} justify="center" align="center">
        <Stepper length={2} currentStep={1} />
      </Stack>
      <Stack padding={16}>
        <Text variant="h5" weight="semibold" align="center">
          {t('Edit Extension Presentation')}
        </Text>
      </Stack>
      <ExtensionReviewAndPublish
        extensionData={extData}
        title={t('Review Extension')}
        subtitle={{
          part1: 'Please note that fields marked with',
          part2: 'cannot be edited once submitted.',
        }}
        extensionNameLabel={t('Extension Name')}
        extensionDisplayNameLabel={t('Extension Display Name')}
        sourceFileLabel={t('Github Repository')}
        nsfwLabel={t('Extension NSFW')}
        nsfwDescription={t('You marked it as Not Safe For Work')}
        descriptionLabel={t('Description')}
        galleryLabel={t('Gallery')}
        imageUploadedLabel={t('images uploaded')}
        viewAllLabel={t('View All')}
        documentationLabel={t('Documentation')}
        licenseLabel={t('License')}
        contributorsLabel={t('Contributors')}
        contactInfoLabel={t('Contact Info')}
        tagsLabel={t('Tags')}
        backButtonLabel={t('Cancel')}
        publishButtonLabel={t('Next')}
        transformSource={transformSource}
        onClickCancel={() => {
          navigate({
            to: routes[MY_EXTENSIONS],
          });
        }}
        onClickNext={() => {
          navigate({
            to: '/submit-extension/$extensionId/step2',
          });
        }}
      />
    </Stack>
  );
};
