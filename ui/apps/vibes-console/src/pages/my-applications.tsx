import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import PaginatedTable from '@akashaorg/design-system-components/lib/components/PaginatedTable';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
