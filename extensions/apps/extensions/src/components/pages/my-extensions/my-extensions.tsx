import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import ErrorLoader from '@akashaorg/design-system-core/lib/components/ErrorLoader';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { BookOpenIcon } from '@heroicons/react/24/outline';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDownFilter, {
  DropdownMenuItemGroupType,
} from '@akashaorg/design-system-components/lib/components/BaseDropdownFilter';
import DefaultEmptyCard from '@akashaorg/design-system-components/lib/components/DefaultEmptyCard';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import AppList from '@akashaorg/design-system-components/lib/components/AppList';

import { useGetAppsByPublisherDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { hasOwn, useAkashaStore } from '@akashaorg/ui-awf-hooks';
import { SortOrder, AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionStatus } from '@akashaorg/typings/lib/ui';
import { ExtensionAction } from './extension-action';
import { NotConnnected } from './not-connected';

export const MyExtensionsPage: React.FC<unknown> = () => {
  const { t } = useTranslation('app-extensions');

  const navigate = useNavigate();

  const handleNavigateToCreateApp = () => {
    navigate({ to: '/create-extension' });
  };

  const typeDropDownMenuItems: DropdownMenuItemGroupType[] = [
    {
      id: '0',
      title: t('All'),
      type: 'opt',
    },
    {
      id: '1',
      title: AkashaAppApplicationType.App,
      type: 'opt',
    },
    {
      id: '2',
      title: AkashaAppApplicationType.Widget,
      type: 'opt',
    },
    {
      id: '3',
      title: AkashaAppApplicationType.Plugin,
      type: 'opt',
    },
    {
      id: '4',
      title: AkashaAppApplicationType.Other,
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
      title: ExtensionStatus.Draft,
      type: 'opt',
    },
    {
      id: '2',
      title: ExtensionStatus.Pending,
      type: 'opt',
    },
    {
      id: '3',
      title: ExtensionStatus.Published,
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

  const {
    data: { authenticatedProfile },
  } = useAkashaStore();

  const {
    data: appsByPubReq,
    error,
    fetchMore,
  } = useGetAppsByPublisherDidQuery({
    variables: {
      id: authenticatedProfile?.did.id,
      first: 20,
      sorting: { createdAt: SortOrder.Desc },
    },
    skip: !authenticatedProfile?.did.id,
  });
  const appsData = useMemo(() => {
    return appsByPubReq?.node && hasOwn(appsByPubReq.node, 'akashaAppList')
      ? appsByPubReq.node.akashaAppList?.edges
      : null;
  }, [appsByPubReq]);

  const pageInfo = useMemo(() => {
    return appsByPubReq?.node && hasOwn(appsByPubReq?.node, 'akashaAppList')
      ? appsByPubReq?.node.akashaAppList?.pageInfo
      : null;
  }, [appsByPubReq]);

  const appElements = appsData
    ?.filter(ext => {
      if (selectedType.id === '0') {
        return true;
      }
      return ext.node?.applicationType === selectedType.title;
    })
    .map(ext => {
      return {
        ...ext.node,
        action: <ExtensionAction extensionId={ext.node?.id} />,
      };
    });

  if (!authenticatedProfile?.did.id) {
    return <NotConnnected />;
  }

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
      {!error && appElements?.length === 0 && (
        <DefaultEmptyCard
          noBorder={true}
          infoText={t('You haven’t created any extensions yet')}
          assetName="longbeam-notfound"
        />
      )}
      {!error && appElements?.length > 0 && (
        <Card customStyle="pb-0">
          <AppList
            apps={appElements}
            showAppTypeIndicator
            onLoadMore={() => {
              if (pageInfo && pageInfo.hasNextPage) {
                return fetchMore({
                  variables: {
                    after: pageInfo.endCursor,
                  },
                });
              }
              return null;
            }}
          />
        </Card>
      )}
    </Stack>
  );
};
