import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import PaginatedTable from '@akashaorg/design-system-components/lib/components/PaginatedTable';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { NoItemFound } from '../components/no-item-found';

export const MyApplications: React.FC<unknown> = () => {
  const { t } = useTranslation('vibes-console');

  const loggedUserApplications = [];

  if (!loggedUserApplications.length) {
    return (
      <Card className="shadow-none">
        <NoItemFound title="No applications found" />
      </Card>
    );
  }

  return (
    <Stack spacing="gap-y-4">
      <Typography variant="h5">{t('Your Applications')}</Typography>
      <PaginatedTable
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
