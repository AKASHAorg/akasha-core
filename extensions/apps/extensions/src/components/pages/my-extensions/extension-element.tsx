import React from 'react';
import { useTranslation } from 'react-i18next';
import getSDK from '@akashaorg/awf-sdk';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import {
  Plugin,
  App,
  Widget,
} from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
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
  AkashaAppApplicationType,
  AkashaAppsStreamModerationStatus,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ExtensionStatus } from '@akashaorg/typings/lib/ui';
import { useNavigate } from '@tanstack/react-router';

type Extension = {
  id?: string;
  name?: string;
  displayName?: string;
  logoImage?: AppImageSource;
  description?: string;
  applicationType?: AkashaAppApplicationType;
};

type ExtensionElement = {
  extensionData: Extension;
  showDivider?: boolean;
  filter: { id?: string; title?: string; opt?: string };
};

export const ExtensionElement: React.FC<ExtensionElement> = ({
  extensionData,
  showDivider,
  filter,
}) => {
  const { t } = useTranslation('app-extensions');
  const sdk = React.useRef(getSDK());

  const { navigateToModal } = useRootComponentProps();
  const navigate = useNavigate();

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
    skip: !extensionData.id.trim() || extensionData.id.length < 10,
  });

  const appStreamData =
    appStreamReq?.node && hasOwn(appStreamReq.node, 'akashaAppsStreamList')
      ? appStreamReq.node.akashaAppsStreamList
      : null;

  const getIconByAppType = (applicationType: AkashaAppApplicationType) => {
    switch (applicationType) {
      case AkashaAppApplicationType.App:
        return <App />;
      case AkashaAppApplicationType.Plugin:
        return <Plugin />;
      case AkashaAppApplicationType.Widget:
        return <Widget />;
    }
  };

  const getExtensionStatus = () => {
    switch (appStreamData?.edges[0]?.node?.status) {
      case null:
        return ExtensionStatus.Draft;
      case AkashaAppsStreamModerationStatus.InReview:
        return ExtensionStatus.Pending;
      case AkashaAppsStreamModerationStatus.Ok:
        return ExtensionStatus.Published;
      default:
        return ExtensionStatus.Draft;
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

  const handleExtensionEdit = () => {
    navigate({
      to: `/edit-extension/$extensionId/step1`,
      params: { extensionId: extensionData.id },
    });
  };

  const menuItems = (extensionStatus: string): MenuProps['items'] | [] => {
    switch (extensionStatus) {
      case ExtensionStatus.Pending:
        return [
          {
            label: t('Check status'),
            icon: <ClockIcon />,
            onClick: () => {},
          },
        ];
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
            onClick: handleExtensionEdit,
          },
          {
            label: t('Unpublish'),
            icon: <XMarkIcon />,
            onClick: () => {},
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ];
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
            onClick: handleExtensionEdit,
          },
          {
            label: t('Delete'),
            icon: <XMarkIcon />,
            onClick: handleExtensionRemove,
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ];
      default:
        return [];
    }
  };

  const showElement = () => {
    if (filter.id === '0') {
      return true;
    }
    return filter.title === getExtensionStatus();
  };

  return (
    <>
      {showElement() && (
        <Stack spacing="gap-y-4">
          <Stack direction="row" justify="between" spacing="gap-x-8">
            <Stack direction="row" spacing="gap-x-3">
              <AppAvatar
                appType={extensionData.applicationType}
                avatar={extensionData.logoImage}
                extensionId={extensionData.id}
              />
              <Stack direction="column" justify="between">
                <Stack direction="row" spacing="gap-2">
                  <Text variant="button-sm">{extensionData.name}</Text>

                  {extensionData?.applicationType && (
                    <Stack
                      customStyle="w-[18px] h-[18px] rounded-full"
                      background={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      justify="center"
                      align="center"
                    >
                      <Icon
                        color={{ light: 'secondaryLight', dark: 'white' }}
                        size={'xs'}
                        solid
                        icon={getIconByAppType(extensionData?.applicationType)}
                      />
                    </Stack>
                  )}
                </Stack>
                <Text
                  variant="footnotes2"
                  weight="normal"
                  color={{ light: 'grey4', dark: 'grey7' }}
                  lineClamp={2}
                >
                  {extensionData.description || extensionData.displayName}
                </Text>
              </Stack>
            </Stack>

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
          </Stack>
          {showDivider && <Divider />}
        </Stack>
      )}
    </>
  );
};
