import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import PaginatedTable from '@akashaorg/design-system-components/lib/components/PaginatedTable';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { renderChevron, renderDate, renderStatus } from '../utils';
import routes, { MY_APPLICATION_DETAIL } from '../routes';
import { NoItemFound } from '../components/no-item-found';

export const MyApplications: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');
  const handleRowClick = (applicationId: string) => {
    navigate({
      to: routes[MY_APPLICATION_DETAIL],
      params: {
        applicationId,
      },
    });
  };
  const loggedUserApplications = [];

  if (!loggedUserApplications.length) {
    return (
      <Card>
        <NoItemFound title="No applications found" />
      </Card>
    );
  }
  const loggedUserApplicationsRows = loggedUserApplications.map(({ id, resolvedDate, status }) => ({
    value: [renderDate(resolvedDate), renderStatus(status), renderChevron()],
    clickHandler: () => handleRowClick(id),
  }));
  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Your Applications')}</Text>
      <PaginatedTable
        rows={loggedUserApplicationsRows}
        pageCount={1}
        currentPage={1}
        onClickPage={() => {
          /** */
        }}
        onClickPrev={() => {
          /** */
        }}
        onClickNext={() => {
          /** */
        }}
      />
    </Stack>
  );
};
