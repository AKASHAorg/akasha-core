import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  ArrowUpOnSquareIcon,
  BookOpenIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDownFilter, {
  DropdownMenuItemGroupType,
} from '@akashaorg/design-system-components/lib/components/BaseDropdownFilter';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { EllipsisHorizontalIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';

export const MyExtensionsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  const handleNavigateToCreateApp = () => {
    navigate({ to: '/create-extension' });
  };

  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const { data: appsByPubReq, error } = useGetAppsByPublisherDidQuery({
    variables: { id: authenticatedProfile?.did.id },
    skip: !authenticatedProfile?.did.id,
  });
  const appsData =
    appsByPubReq?.node && hasOwn(appsByPubReq.node, 'apps') ? appsByPubReq.node.apps : null;

  const createdApps = [];

  const menuItems = (appStatus: string) => {
    switch (appStatus) {
      case 'pending':
        return [
          {
            label: t('Check status'),
            icon: <ClockIcon />,
            onClick: () => {},
          },
        ] as MenuProps['items'];
      case 'published':
        return [
          {
            label: t('View'),
            icon: <EyeIcon />,
            onClick: () => {},
          },
          {
            label: t('Edit'),
            icon: <PencilIcon />,
            onClick: () => {},
          },
          {
            label: t('Unpublish'),
            icon: <XMarkIcon />,
            onClick: () => {},
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'];
      case 'draft':
        return [
          {
            label: t('Publish'),
            icon: <ArrowUpOnSquareIcon />,
            onClick: () => {},
          },
          {
            label: t('Edit'),
            icon: <PencilIcon />,
            onClick: () => {},
          },
          {
            label: t('Delete'),
            icon: <XMarkIcon />,
            onClick: () => {},
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'];
      default:
        return [];
    }
  };

  const appElements = createdApps.map(ext => ({
    ...ext,
    action: (
      <Stack direction="column" justify="between">
        <Menu
          anchor={{
            icon: <EllipsisHorizontalIcon />,
            variant: 'primary',
            greyBg: true,
            iconOnly: true,
            'aria-label': 'settings',
          }}
          items={menuItems(ext.status)}
          customStyle="w-max z-99"
        />
        <Stack direction="row" align="center" spacing="gap-x-1.5">
          <Stack
            customStyle={`w-2 h-2 rounded-full ${
              ext.status === 'Kept' ? 'bg-success' : 'bg-(errorLight dark:errorDark)'
            }`}
          />
          <Text variant="footnotes2" weight="normal">
            {ext.status}
          </Text>
        </Stack>
      </Stack>
    ),
  }));

  const typeDropDownMenuItems: DropdownMenuItemGroupType[] = [
    {
      id: '0',
      title: t('All'),
      type: 'opt',
    },
    {
      id: '1',
      title: 'App',
      type: 'opt',
    },
    {
      id: '2',
      title: 'Widget',
      type: 'opt',
    },
    {
      id: '3',
      title: 'Plugin',
      type: 'opt',
    },
  ];

  const [selectedType, setSelectedType] = React.useState<DropdownMenuItemGroupType | null>(
    typeDropDownMenuItems[0],
  );

  const statusDropDownMenuItems: DropdownMenuItemGroupType[] = [
    {
      id: '0',
      title: t('All'),
      type: 'opt',
    },
    {
      id: '1',
      title: 'Draft',
      type: 'opt',
    },
    {
      id: '2',
      title: 'Pending',
      type: 'opt',
    },
    {
      id: '3',
      title: 'Published',
      type: 'opt',
    },
  ];

  const [selectedStatus, setSelectedStatus] = React.useState<DropdownMenuItemGroupType | null>(
    statusDropDownMenuItems[0],
  );

  const handleResetClick = () => {
    setSelectedStatus(statusDropDownMenuItems[0]);
    setSelectedType(typeDropDownMenuItems[0]);
  };

  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" justify="between">
        <Text variant="h5">{t('My extensions')}</Text>
        <Link target="_blank" to="https://docs.akasha.world" customStyle="w-fit self-end">
          <Icon icon={<BookOpenIcon />} accentColor />
        </Link>
      </Stack>
      <Stack
        direction="row"
        justify="between"
        align="center"
        padding={12}
        background={{ light: 'grey9', dark: 'grey5' }}
        customStyle="rounded-3xl"
      >
        <Text variant="body1">{t('Create an extension ✨ 🚀')}</Text>
        <Button variant="primary" label={t('Create')} onClick={handleNavigateToCreateApp} />
      </Stack>
      <Stack direction="row" justify="between" align="center" spacing="gap-2">
        <DropDownFilter
          menuItems={typeDropDownMenuItems}
          selected={selectedType}
          setSelected={setSelectedType}
          placeholderLabel={t('Type')}
          padding={'p-2'}
        />
        <DropDownFilter
          menuItems={statusDropDownMenuItems}
          selected={selectedStatus}
          setSelected={setSelectedStatus}
          placeholderLabel={t('Status')}
          padding={'p-2'}
        />
        <Button variant="text" onClick={handleResetClick} label={t('Reset')} />
      </Stack>
      {error && (
        <ErrorLoader
          type="script-error"
          title={'Sorry, there was an error when fetching apps'}
          details={<>{error.message}</>}
        />
      )}
      {!error && createdApps.length === 0 && (
        <DefaultEmptyCard
          noBorder={true}
          infoText={t('You haven’t created any extensions yet')}
          assetName="longbeam-notfound"
        />
      )}
      {!error && createdApps.length > 0 && (
        <Card>
          <AppList apps={appElements} />
        </Card>
      )}
    </Stack>
  );
};
