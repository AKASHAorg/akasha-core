import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from '@tanstack/react-router';
import getSDK from '@akashaorg/core-sdk';
import ExtensionIcon from '@akashaorg/design-system-core/lib/components/ExtensionIcon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import AppAvatar from '@akashaorg/design-system-core/lib/components/AppAvatar';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Menu from '@akashaorg/design-system-core/lib/components/Menu';
import {
  EyeIcon,
  SendHorizonalIcon,
  PencilIcon,
  LayoutGridIcon,
  Trash2Icon,
  EllipsisIcon,
} from 'lucide-react';
import { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import { selectAkashaAppStreamStatus } from '@akashaorg/ui-core-hooks/lib/selectors/get-apps-stream-query';
import { useGetAppsStreamQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { ExtensionStatus } from '@akashaorg/typings/lib/ui';
import { getExtensionStatus, getStatusIndicatorStyle } from '../../../utils/extension-utils';
import {
  AkashaAppApplicationType,
  AppImageSource,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

type ExtensionElement = {
  extensionId: string;
  extensionName?: string;
  extensionDisplayName?: string;
  extensionDescription?: string;
  extensionApplicationType?: AkashaAppApplicationType;
  extensionLogoImage?: AppImageSource;
  isExtensionLocalDraft?: boolean;
  showDivider?: boolean;
  filter?: string;
  filterShowAllOptionValue?: string;
  showMenu?: boolean;
};

export const ExtensionElement: React.FC<ExtensionElement> = ({
  extensionId,
  extensionName,
  extensionDisplayName,
  extensionDescription,
  extensionApplicationType,
  extensionLogoImage,
  isExtensionLocalDraft,
  showDivider = false,
  filter,
  filterShowAllOptionValue,
  showMenu = false,
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
            equalTo: extensionId,
          },
        },
      },
    },
    fetchPolicy: 'cache-first',
    notifyOnNetworkStatusChange: true,
    skip: !extensionId || !extensionId?.trim() || extensionId?.length < 10 || isExtensionLocalDraft,
  });

  const appStreamStatus = selectAkashaAppStreamStatus(appStreamReq);

  const handleExtensionRemove = () => {
    navigateToModal({
      name: `remove-extension-confirmation`,
      extensionId: extensionId,
    });
  };

  const handleEditLocalExtension = () => {
    navigate({
      to: `/edit-extension/$extensionId/step1`,
      params: { extensionId: extensionId },
    });
  };

  const handleEditPublishedExtension = () => {
    navigate({
      to: `/edit-published-extension/$extensionId/form`,
      params: { extensionId: extensionId },
    });
  };

  const handleNavigateToExtensionInfoPage = () => {
    navigate({
      to: `/info/$appId`,
      params: { appId: extensionName },
    });
  };

  const handleExtensionSubmit = () => {
    navigate({
      to: `/publish-extension/$extensionId`,
      params: { extensionId: extensionId },
    });
  };

  const handleReleaseManager = () => {
    navigate({
      to: `/release-manager/$extensionId`,
      params: { extensionId: extensionId },
    });
  };

  const style = 'h-4 w-4 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';
  const style2 = 'h-4 w-4 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark';

  const menuItems = (extensionStatus: string): MenuProps['items'] | [] => {
    switch (extensionStatus) {
      case ExtensionStatus.InReview:
        return [
          {
            label: t('View Extension'),
            icon: <EyeIcon className={style} />,
            onClick: handleNavigateToExtensionInfoPage,
          },
          {
            label: t('Edit Extension'),
            icon: <PencilIcon className={style} />,
            onClick: handleEditPublishedExtension,
          },
          {
            label: t('Release Manager'),
            icon: <LayoutGridIcon className={style} />,
            onClick: handleReleaseManager,
          },
          {
            label: t('Delete Extension'),
            icon: <Trash2Icon className={style2} />,
            onClick: handleExtensionRemove,
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ];
      case ExtensionStatus.Published:
        return [
          {
            label: t('View Extension'),
            icon: <EyeIcon className={style} />,
            onClick: handleNavigateToExtensionInfoPage,
          },
          {
            label: t('Edit Extension'),
            icon: <PencilIcon className={style} />,
            onClick: handleEditPublishedExtension,
          },
          {
            label: t('Release Manager'),
            icon: <LayoutGridIcon className={style} />,
            onClick: handleReleaseManager,
          },
          {
            label: t('Delete Extension'),
            icon: <Trash2Icon className={style2} />,
            onClick: handleExtensionRemove,
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ];
      case ExtensionStatus.LocalDraft:
        return [
          {
            label: t('Publish Extension'),
            icon: <SendHorizonalIcon className={style} />,
            onClick: handleExtensionSubmit,
          },
          {
            label: t('Edit Extension'),
            icon: <PencilIcon className={style} />,
            onClick: handleEditLocalExtension,
          },
          {
            label: t('Release Manager'),
            icon: <LayoutGridIcon className={style} />,
            onClick: handleReleaseManager,
          },
          {
            label: t('Delete Extension'),
            icon: <Trash2Icon className={style2} />,
            onClick: handleExtensionRemove,
            color: { light: 'errorLight', dark: 'errorDark' },
          },
        ];
      default:
        return [];
    }
  };

  const showElement = () => {
    if (!filter) {
      return true;
    } else if (filter) {
      if (filter === filterShowAllOptionValue) {
        return true;
      }
      return filter === getExtensionStatus(isExtensionLocalDraft, appStreamStatus);
    }
  };

  const iconType = useMemo(() => extensionApplicationType, [extensionApplicationType]);

  if (!showElement()) return null;

  return (
    <Stack spacing={4}>
      <Stack direction="row" justifyContent="between" spacing={8} className="w-full">
        <Stack direction="row" spacing={3} className="max-h-[60px] w-[60%]">
          <AppAvatar
            appType={extensionApplicationType}
            avatar={transformSource(extensionLogoImage)}
            extensionId={extensionId}
          />
          <Stack direction="column" justifyContent="between" className="w-0 min-w-full">
            <Stack direction="row" spacing={2}>
              <Text variant="button-sm" truncate>
                {extensionName}
              </Text>

              {extensionApplicationType && (
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  className="w-[18px] h-[18px] rounded-full shrink-0 bg-inherit"
                >
                  <ExtensionIcon size="xs" type={iconType} />
                </Stack>
              )}
            </Stack>
            <Text
              variant="footnotes2"
              weight="normal"
              color={{ light: 'grey4', dark: 'grey7' }}
              truncate
            >
              {extensionDescription || extensionDisplayName}
            </Text>
          </Stack>
        </Stack>

        <Stack
          direction="column"
          justifyContent={showMenu ? 'between' : 'end'}
          alignItems="end"
          className="shrink-0"
        >
          {showMenu && (
            <Menu
              anchor={{
                icon: <EllipsisIcon />,
                variant: 'primary',
                greyBg: true,
                iconOnly: true,
                'aria-label': 'settings',
              }}
              items={menuItems(getExtensionStatus(isExtensionLocalDraft, appStreamStatus))}
              customStyle="w-max z-99"
            />
          )}
          <Stack direction="row" alignItems="center" spacing={1}>
            <div
              className={`w-2 h-2 rounded-full ${getStatusIndicatorStyle(isExtensionLocalDraft, appStreamStatus)}`}
            />
            <Text variant="footnotes2" weight="normal">
              {getExtensionStatus(isExtensionLocalDraft, appStreamStatus)}
            </Text>
          </Stack>
        </Stack>
      </Stack>
      {showDivider && <Divider />}
    </Stack>
  );
};
