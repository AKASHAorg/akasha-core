import React, { useEffect, useMemo, useRef, useState } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import {
  ContentBlockExtension,
  MatchingBlock,
} from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useGetContentBlockByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { Transition } from '@headlessui/react';

type ContentBlockType = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean;
  beamIsNsfw: boolean;
  showBlockName: boolean;
  onBlockInfoChange?: (blockInfo: { blockName: string; appName: string }) => void;
  onContentClick?: () => void;
};
const ContentBlock: React.FC<ContentBlockType> = props => {
  const {
    blockID,
    authenticatedDID,
    showHiddenContent,
    beamIsNsfw,
    showBlockName,
    onBlockInfoChange,
    onContentClick,
  } = props;
  const { t } = useTranslation('ui-lib-feed');
  const { getExtensionsPlugin } = useRootComponentProps();
  const contentBlockStoreRef = useRef(getExtensionsPlugin()?.contentBlockStore);
  const contentBlockReq = useGetContentBlockByIdQuery({
    variables: { id: blockID },
  });

  /*
   * get user's NSFW settings from the hook
   */
  const { showNsfw } = useNsfwToggling();

  /*
   * internal state for showing the NSFW content behind the overlay, default to false
   */
  const [showNsfwContent, setShowNsfwContent] = useState(false);
  /*
   * Get all the block's data from the hook, including the nsfw property
   */
  const { navigateToModal } = useRootComponentProps();
  const _onBlockInfoChange = useRef(onBlockInfoChange);
  const blockData = useMemo(() => {
    return contentBlockReq.data?.node && hasOwn(contentBlockReq.data.node, 'id')
      ? contentBlockReq.data.node
      : null;
  }, [contentBlockReq.data]);
  const contentBlockPropertyType = blockData?.content?.[0]?.propertyType;
  const contentBlockLabel = blockData?.content?.[0]?.label;
  const nsfw = !!blockData?.nsfw;
  const matchingBlocks: MatchingBlock[] = contentBlockStoreRef.current.getMatchingBlocks(blockData);
  const foundBlock = matchingBlocks.find(matchingBlock => {
    if (matchingBlock.blockData && hasOwn(matchingBlock.blockData, 'id'))
      return matchingBlock.blockData?.id === blockID;

    return false;
  });
  const blockDisplayName = foundBlock ? foundBlock.blockInfo.displayName : '';

  /* Show NSFW card (overlay) only when the block is marked as NSFW and any of
   * the following conditions is met:
   * 1. The user toggled off NSFW content in their settings or is not logged in, or
   * 2. The showNsfwContent flag is false (Nsfw content is hidden)
   * If the user is logged in and has their NSFW setting turned on (They want to see
   * NSFW content) or if this block
   *  is marked as nsfw and the whole beam is also marked as nsfw (When both are NSFW, we
   * don't want to display the overlays two times), we will never show
   * this overlay.
   */
  const showNSFWCard =
    (beamIsNsfw && nsfw) || (showNsfw && !!authenticatedDID)
      ? false
      : nsfw && (!showNsfw || !authenticatedDID) && !showNsfwContent;

  const showLoginModal = () => {
    navigateToModal({
      name: 'login',
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
    });
  };

  useEffect(() => {
    _onBlockInfoChange.current?.({
      appName: BLOCK_LABEL_TO_APP_DISPLAY_NAME_MAP[contentBlockLabel],
      blockName:
        contentBlockPropertyType /*@TODO need to fetch the proper human readable block name*/,
    });
  }, [contentBlockPropertyType, contentBlockLabel]);

  return (
    <Card
      type="plain"
      onClick={() => {
        if (!showNSFWCard || !nsfw) {
          if (typeof onContentClick === 'function') {
            onContentClick();
          }
        }
      }}
    >
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
            mode={ContentBlockModes.READONLY}
            blockData={blockData}
            matchingBlocks={matchingBlocks}
            error={contentBlockReq.error?.message ?? ''}
            errorTitle={t('Block not loaded correctly')}
            errorDescription={t('Click on refresh to try reloading the block.')}
            refreshLabel={t('Refresh')}
            notInstalledTitle={t('not installed')}
            notInstalledDescription1={t('Please install')}
            notInstalledDescription2={t('to view this content.')}
            onRefresh={() => {
              contentBlockReq.refetch({ id: blockID });
            }}
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
                setShowNsfwContent(true);
              }}
            />
          </Card>
        </Stack>
      )}
    </Card>
  );
};

//@TODO properly fetch app's display name
const BLOCK_LABEL_TO_APP_DISPLAY_NAME_MAP = {
  '@akashaorg/app-akasha-integration': 'Antenna',
};

export default ContentBlock;
