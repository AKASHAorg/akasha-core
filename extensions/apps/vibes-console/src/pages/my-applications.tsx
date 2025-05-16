import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@akashaorg/ui/lib/akasha-components/pagination';
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
      <Card className="shadow-none">
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
      <Typography variant="h5">{t('Your Applications')}</Typography>
      {/* update design or add pagination to the table, if needed */}
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </Stack>
  );
};
