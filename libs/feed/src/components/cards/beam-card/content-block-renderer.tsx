import React, { useEffect, useMemo, useRef } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  ContentBlockExtension,
  MatchingBlock,
} from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { useTranslation } from 'react-i18next';
import {
  useGetAppsByPublisherDidSuspenseQuery,
  useGetContentBlockByIdQuery,
} from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { Transition } from '@headlessui/react';
import getSDK from '@akashaorg/core-sdk';
import { SortOrder } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { GetAppsByPublisherDidQuery } from '@akashaorg/typings/lib/sdk/graphql-operation-types-new';

type ContentBlockRendererProps = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean;
  beamIsNsfw: boolean;
  showBlockName: boolean;
  onBlockInfoChange?: (blockInfo: { blockName: string; appName: string }) => void;
  onContentClick?: () => void;
};
const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = props => {
  const {
    blockID,
    authenticatedDID,
    showHiddenContent,
    beamIsNsfw,
    showBlockName,
    onBlockInfoChange,
  } = props;
  const sdk = useRef(getSDK());
  const indexingDID = sdk.current.services.common.misc.getIndexingDID();
  const { navigateToModal, getCorePlugins } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getCorePlugins()?.contentBlockStore);
  const _onBlockInfoChange = useRef(onBlockInfoChange);
  const { t } = useTranslation('ui-lib-feed');
  const navigateTo = getCorePlugins().routing.navigateTo;
  const contentBlockReq = useGetContentBlockByIdQuery({
    variables: { id: blockID },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only',
  });
  const blockData = useMemo(() => {
    // Get all the block's data from the hook, including the nsfw property
    return contentBlockReq.data?.node && hasOwn(contentBlockReq.data.node, 'id')
      ? contentBlockReq.data.node
      : null;
  }, [contentBlockReq.data]);
  const contentBlockPropertyType = blockData?.content?.[0]?.propertyType;
  const contentBlockLabel = blockData?.content?.[0]?.label;
  // {
  //   id: did,
  //     first: 1,
  //   filters: { where: { name: { equalTo: appName } } },
  //   sorting: { createdAt: SortOrder.Desc },
  // },
  // { context: { source: sdk.services.gql.contextSources.default } },

  const appQuery = useGetAppsByPublisherDidSuspenseQuery({
    variables: {
      id: indexingDID,
      first: 1,
      filters: { where: { name: { equalTo: contentBlockLabel } } },
      sorting: { createdAt: SortOrder.Asc },
    },
    context: { source: sdk.current.services.gql.contextSources.default },
    skip: !!indexingDID && !!contentBlockLabel,
  });

  const appDisplayName = selectAppDisplayName(appQuery?.data);

  useEffect(() => {
    _onBlockInfoChange.current?.({
      appName: appDisplayName,
      blockName: contentBlockPropertyType,
    });
  }, [contentBlockPropertyType, contentBlockLabel, appDisplayName]);

  const matchingBlocks: MatchingBlock[] = !blockData
    ? []
    : contentBlockStoreRef.current.getMatchingBlocks(blockData);
  const foundBlock = matchingBlocks.find(matchingBlock => {
    if (matchingBlock.blockData && hasOwn(matchingBlock.blockData, 'id'))
      return matchingBlock.blockData?.id === blockID;

    return false;
  });
  const blockDisplayName = foundBlock?.blockInfo?.displayName ?? '';

  /**
   * beam is nsfw (at least one block is nsfw)
   * 1. user is not logged in = show overlay and when clicked, prompt login
   * 2. user is logged in:
   * a. has settings off (also check beam level nsfw) = show overlay
   * b. has settings on = hide overlay
   */

  const showNSFWCard = beamIsNsfw && !authenticatedDID;

  const showLoginModal = () => {
    navigateToModal({
      name: 'login',
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
    });
  };

  const handleClickInstall = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    navigateTo({
      appName: '@akashaorg/app-extensions',
      getNavigationUrl: routes => routes.apps,
    });
  };

  return (
    <Card type="plain" customStyle="w-full">
      {!showNSFWCard && (
        <>
          <Transition
            enter="transition-[height] ease-out duration-300"
            enterFrom="h-0"
            enterTo="h-[18px]"
            leave="transition-[height] ease-in duration-300"
            leaveFrom="h-[18px]"
            leaveTo="h-0"
            show={showBlockName && !!blockDisplayName}
          >
            <Text variant="footnotes2" weight="normal" color={{ light: 'grey7', dark: 'grey6' }}>
              {t('{{blockDisplayName}}', { blockDisplayName })}
            </Text>
          </Transition>
          <ContentBlockExtension
            blockData={blockData}
            matchingBlocks={matchingBlocks}
            cacheBlockConfig={true}
            error={contentBlockReq.error?.message ?? ''}
            fetchError={{
              errorTitle: t('Network error occurred'),
              errorDescription: t('Click on refresh to try reloading the block.'),
            }}
            contentLoadError={{
              errorTitle: t('Content not loaded correctly'),
              errorDescription: t('Unable to load content, please try again later.'),
            }}
            installButtonLabel={t('Install')}
            notInstalledTitle={t('not installed')}
            notInstalledDescription1={t('Please install')}
            notInstalledDescription2={t('to view this content.')}
            refreshLabel={t('Refresh')}
            onRefresh={() => {
              contentBlockReq.refetch({ id: blockID });
            }}
            onClickInstall={handleClickInstall}
          />
        </>
      )}
      {showHiddenContent && showNSFWCard && (
        <Stack
          justify="center"
          direction="row"
          background={{ light: 'grey9', dark: 'grey5' }}
          customStyle="rounded-[10px]"
        >
          <Card
            type={'regular'}
            background={{ light: 'white', dark: 'grey3' }}
            elevation="2"
            margin="m-3.5"
            padding="p-2"
            customStyle="w-fit h-[60px]"
          >
            {/* showHiddenContent is the flag used to hide nsfw blocks in the
             * feed when NSFW settings is off and shows the overlay over it when
             * on beam page (set to true in BeamSection(beam page), otherwise false)
             *  */}
            <NSFW
              clickToViewLabel={t('Click to View')}
              sensitiveContentLabel={t('Sensitive Content!')}
              onClickToView={() => {
                if (!authenticatedDID) {
                  showLoginModal();
                  return;
                }
              }}
            />
          </Card>
        </Stack>
      )}
    </Card>
  );
};

const selectAppDisplayName = (queryData: GetAppsByPublisherDidQuery) => {
  return queryData.node;
};

export default ContentBlockRenderer;
