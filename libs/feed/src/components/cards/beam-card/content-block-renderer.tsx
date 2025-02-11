import React, { useCallback, useMemo, useRef } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-core-hooks';
import {
  ContentBlockExtension,
  MatchingBlock,
} from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { useTranslation } from 'react-i18next';
import { useGetContentBlockByIdQuery } from '@akashaorg/ui-core-hooks/lib/generated/apollo';
import { Transition } from '@headlessui/react';
import {
  selectBlockApp,
  selectBlockData,
} from '@akashaorg/ui-core-hooks/lib/selectors/get-content-block-by-id-query';
import { NetworkStatus } from '@apollo/client';

type ContentBlockRendererProps = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean;
  beamIsNsfw: boolean;
  showBlockName: boolean;
  onContentClick?: () => void;
};

const ContentBlockRenderer: React.FC<ContentBlockRendererProps> = props => {
  const { blockID, authenticatedDID, showHiddenContent, beamIsNsfw, showBlockName } = props;
  const { navigateToModal, getCorePlugins, encodeAppName } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getCorePlugins()?.contentBlockStore);
  const { t } = useTranslation('ui-lib-feed');
  const navigateTo = getCorePlugins().routing.navigateTo;
  const contentBlockReq = useGetContentBlockByIdQuery({
    variables: { id: blockID },
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'network-only',
  });

  const blockData = selectBlockData(contentBlockReq.data);
  const blockApp = selectBlockApp(contentBlockReq.data);

  const matchingBlocks: MatchingBlock[] = useMemo(() => {
    return !blockData || !blockApp ? [] : contentBlockStoreRef.current.getMatchingBlocks(blockData);
  }, [blockData, blockApp]);

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

  const fetchErrorMsg = useMemo(
    () => ({
      errorTitle: !blockApp ? t('Cannot display content') : t('Network error occurred'),
      errorDescription: !blockApp
        ? t('Extension was removed or not available anymore.')
        : t('Click on refresh to try reloading the block.'),
    }),
    [blockApp, t],
  );

  const contentLoadErrorMsg = useMemo(
    () => ({
      errorTitle: t('Content not loaded correctly'),
      errorDescription: t('Unable to load content, please try again later.'),
    }),
    [t],
  );
  const showLoginModal = useCallback(() => {
    navigateToModal({
      name: 'login',
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
    });
  }, [navigateToModal]);

  const onViewNSFWClick = useCallback(() => {
    if (!authenticatedDID) {
      showLoginModal();
      return;
    }
  }, [authenticatedDID, showLoginModal]);

  const handleClickInstall = useCallback(
    (e: React.SyntheticEvent) => {
      e.stopPropagation();
      navigateTo({
        appName: '@akashaorg/app-extensions',
        getNavigationUrl: () => `/info/${encodeAppName(blockApp.name)}`,
      });
    },
    [blockApp, navigateTo],
  );

  const onContentBlockRefresh = useCallback(() => {
    contentBlockReq.refetch({ id: blockID });
  }, [blockID, contentBlockReq]);

  const contentBlockErrors = useMemo(() => {
    if (contentBlockReq.error) {
      return contentBlockReq.error?.message;
    }
    if (!blockApp && contentBlockReq.networkStatus === NetworkStatus.ready) {
      return 'Cannot render the content. Extension is missing.';
    }
    return '';
  }, [contentBlockReq, blockApp]);

  return (
    <Card className="p-0 border-none w-full">
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
            error={contentBlockErrors}
            fetchError={fetchErrorMsg}
            contentLoadError={contentLoadErrorMsg}
            installButtonLabel={t('Install')}
            notInstalledTitle={t('not installed')}
            notInstalledDescription1={t('Please install')}
            notInstalledDescription2={t('to view this content.')}
            refreshLabel={!blockApp ? undefined : t('Refresh')}
            onRefresh={onContentBlockRefresh}
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
          <Card className="bg-background m-3.5 p-2 w-fit h-[60px]">
            {/* showHiddenContent is the flag used to hide nsfw blocks in the
             * feed when 'Show NSFW Content' setting is off and shows the overlay over it when
             * on beam page (set to true in BeamSection(beam page), otherwise false)
             *  */}
            <NSFW
              clickToViewLabel={t('Click to View')}
              sensitiveContentLabel={t('Sensitive Content!')}
              onClickToView={onViewNSFWClick}
            />
          </Card>
        </Stack>
      )}
    </Card>
  );
};

export default ContentBlockRenderer;
