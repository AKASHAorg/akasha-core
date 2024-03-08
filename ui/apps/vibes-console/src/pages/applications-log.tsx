import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Dropdown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { generateModeratorApplicationHistory } from '../utils';
import { ApplicantDataCard } from '../components/applications/application';
import routes, { APPLICATIONS, APPLICATION_DETAIL } from '../routes';

export const ApplicationsLog: React.FC<unknown> = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('vibes-console');

  // list filters
  const statusPlaceholder = t('Status');
  const tenurePlaceholder = t('Member since');

  const defaultStatus = {
    id: null,
    iconName: null,
    title: statusPlaceholder,
  };

  const defaultTenure = {
    id: null,
    iconName: null,
    title: tenurePlaceholder,
  };

  const [filterByStatus, setfilterByStatus] = useState(defaultStatus);
  const [filterByTenure, setfilterByTenure] = useState(defaultTenure);

  const resetFilters = () => {
    setfilterByStatus(defaultStatus);
    setfilterByTenure(defaultTenure);
  };

  const applications = generateModeratorApplicationHistory();

  const handleClickViewProfile = () => {
    navigate({
      to: routes[APPLICATIONS],
    });
  };

  const handleClickViewApplication = (applicationId: string) => {
    navigate({
      to: routes[APPLICATION_DETAIL],
      params: {
        applicationId,
      },
    });
  };

  return (
    <Stack spacing="gap-y-4">
      <Text variant="h5">{t('Applications Log')}</Text>
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" align="center" spacing="gap-x-3">
          <Dropdown
            name="filterByStatus"
            placeholderLabel={statusPlaceholder}
            selected={filterByStatus}
            menuItems={[
              { id: '1', title: 'Pending' },
              { id: '2', title: 'Approved' },
              { id: '3', title: 'Rejected' },
              { id: '4', title: 'Withdrawn' },
            ]}
            setSelected={setfilterByStatus}
          />
          <Dropdown
            name="filterByTenure"
            placeholderLabel={tenurePlaceholder}
            selected={filterByTenure}
            menuItems={[
              { id: '1', title: '2020' },
              { id: '2', title: '2021' },
              { id: '3', title: '2022' },
              { id: '4', title: '2023' },
            ]}
            setSelected={setfilterByTenure}
          />
        </Stack>

        <Button plain={true} onClick={resetFilters}>
          <Text variant="body2" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
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
            onClickViewProfile={handleClickViewProfile}
            onClickViewApplication={() => handleClickViewApplication(a.did.id)}
          />
        ))}
      </>
    </Stack>
  );
};
