import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Table from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { generateUserApplicationHistory, renderChevron, renderDate, renderStatus } from '../utils';

export const MyApplications: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  const handleRowClick = (applicationId: string) => {
    navigate({
      to: '/applications-center/applications/application/$applicationId',
      params: {
        applicationId,
      },
    });
  };

  const loggedUserApplications = generateUserApplicationHistory();

  const loggedUserApplicationsRows = loggedUserApplications.map(({ id, resolvedDate, status }) => ({
    value: [renderDate(resolvedDate), renderStatus(status), renderChevron()],
    clickHandler: () => handleRowClick(id),
  }));

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Your Applications')}</Text>

      <Card padding={0}>
        <Table rows={loggedUserApplicationsRows} />
      </Card>
    </Stack>
  );
};
