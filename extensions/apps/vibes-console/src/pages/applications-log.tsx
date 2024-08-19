import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ApplicantDataCard } from '../components/applications/application';
import { NoItemFound } from '../components/no-item-found';
import routes, { APPLICATION_DETAIL } from '../routes';

export const ApplicationsLog: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');
  // list filters
  const defaultStatus = 'Status';
  const defaultTenure = 'Member since';

  const [filterByStatus, setfilterByStatus] = useState(defaultStatus);
  const [filterByTenure, setfilterByTenure] = useState(defaultTenure);
  const resetFilters = () => {
    setfilterByStatus(defaultStatus);
    setfilterByTenure(defaultTenure);
  };
  const applications = [];
  const handleClickViewApplication = (applicationId: string) => {
    navigate({
      to: routes[APPLICATION_DETAIL],
      params: {
        applicationId,
      },
    });
  };
  if (!applications.length) {
    return (
      <Card>
        <NoItemFound title="No applications found" />
      </Card>
    );
  }
  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Applications Log')}</Text>
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" align="center" spacing="gap-x-3">
          <Dropdown
            name="filterByStatus"
            placeholderLabel={defaultStatus}
            selected={filterByStatus}
            menuItems={['Pending', 'Approved', 'Rejected', 'Withdrawn']}
            setSelected={setfilterByStatus}
          />
          <Dropdown
            name="filterByTenure"
            placeholderLabel={defaultTenure}
            selected={filterByTenure}
            menuItems={['2020', '2021', '2022', '2023']}
            setSelected={setfilterByTenure}
          />
        </Stack>
        <Button plain={true} onClick={resetFilters}>
          <Text variant="button-sm" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {`${t('Reset')}`}
          </Text>
        </Button>
      </Stack>
      <>
        {applications.map(a => (
          <ApplicantDataCard
            key={a.did.id}
            applicant={a}
            tenureInfoLabel={t('Member since')}
            appliedOnLabel={t('Applied on')}
            viewProfileLabel={t('View profile')}
            viewApplicationLabel={t('View application')}
            onClickViewProfile={() => {
              /** */
            }}
            onClickViewApplication={() => handleClickViewApplication(a.did.id)}
          />
        ))}
      </>
    </Stack>
  );
};
