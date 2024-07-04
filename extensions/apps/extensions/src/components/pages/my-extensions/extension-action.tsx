import React from 'react';
import { useTranslation } from 'react-i18next';
import getSDK from '@akashaorg/awf-sdk';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import {
  ArrowUpOnSquareIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { EllipsisHorizontalIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetAppsStreamQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import {
  AkashaApp,
  AkashaAppsStreamModerationStatus,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionStatus } from '@akashaorg/typings/lib/ui';

type ExtensionAction = {
  extensionData: Omit<AkashaApp, 'version'>;
};

export const ExtensionAction: React.FC<ExtensionAction> = ({ extensionData }) => {
  const { t } = useTranslation('app-extensions');
  const sdk = React.useRef(getSDK());

  const { navigateToModal } = useRootComponentProps();

  const { data: appStreamReq } = useGetAppsStreamQuery({
    variables: {
      indexer: sdk.current.services.gql.indexingDID,
      first: 1,
      filters: {
        where: {
          applicationID: {
            equalTo: extensionData.id,
          },
        },
      },
    },
    skip: !extensionData.id,
  });

  const appStreamData =
    appStreamReq?.node && hasOwn(appStreamReq.node, 'akashaAppsStreamList')
      ? appStreamReq.node.akashaAppsStreamList
      : null;

  const getExtensionStatus = () => {
    if (appStreamData?.edges?.length === 0) {
      return ExtensionStatus.Draft;
    }
    if (appStreamData?.edges[0]) {
      if (appStreamData?.edges[0].node?.status === AkashaAppsStreamModerationStatus.InReview) {
        return ExtensionStatus.Pending;
      }
      if (appStreamData?.edges[0].node?.status === AkashaAppsStreamModerationStatus.Ok) {
        return ExtensionStatus.Published;
      }
    }
  };

  const getStatusIndicatorStyle = () => {
    switch (getExtensionStatus()) {
      case ExtensionStatus.Draft:
        return 'bg-grey6';
      case ExtensionStatus.Published:
        return 'bg-success';
      case ExtensionStatus.Pending:
        return 'bg-(errorLight dark:errorDark)';
      default:
        return 'bg-grey6';
    }
  };

  const handleExtensionRemove = () => {
    navigateToModal({
      name: `remove-extension-confirmation`,
      extensionId: extensionData.id,
    });
  };

  const menuItems = (extensionStatus: string) => {
    switch (extensionStatus) {
      case ExtensionStatus.Pending:
        return [
          {
            label: t('Check status'),
            icon: <ClockIcon />,
            onClick: () => {},
          },
        ] as MenuProps['items'];
      case ExtensionStatus.Published:
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
      case ExtensionStatus.Draft:
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
            onClick: handleExtensionRemove,
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ] as MenuProps['items'];
      default:
        return [];
    }
  };

  return (
    <Stack direction="column" justify="between">
      <Menu
        anchor={{
          icon: <EllipsisHorizontalIcon />,
          variant: 'primary',
          greyBg: true,
          iconOnly: true,
          'aria-label': 'settings',
        }}
        items={menuItems(getExtensionStatus())}
        customStyle="w-max z-99"
      />
      <Stack direction="row" align="center" spacing="gap-x-1.5">
        <Stack customStyle={`w-2 h-2 rounded-full ${getStatusIndicatorStyle()}`} />
        <Text variant="footnotes2" weight="normal">
          {getExtensionStatus()}
        </Text>
      </Stack>
    </Stack>
  );
};
