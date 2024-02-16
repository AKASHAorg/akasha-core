import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useNsfwToggling } from '@akashaorg/ui-awf-hooks';
import { useBlockData } from './use-block-data';

type ContentBlockType = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean;
  onBlockInfoChange?: (blockInfo: { blockName: string; appName: string }) => void;
};
const ContentBlock: React.FC<ContentBlockType> = props => {
  const { blockID, authenticatedDID, showHiddenContent, onBlockInfoChange } = props;
  const { t } = useTranslation('ui-lib-feed');

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
  const { nsfw, blockName, appName, addBlockData, addBlockInfo } = useBlockData();
  const { navigateToModal } = useRootComponentProps();
  const _onBlockInfoChange = useRef(onBlockInfoChange);

  /* Show NSFW card (overlay) only when the block is marked as NSFW and any of
   * the following conditions is met:
   * 1. The user toggled off NSFW content in their settings or is not logged in, or
   * 2. The showNsfwContent flag is false
   * If the user is logged in and has their NSFW setting turned on, we will never show
   * thie overlay, regardless of whether the block is NSFW or not (showNSFWCard is always
   * false).
   */
  const showNSFWCard =
    showNsfw && !!authenticatedDID
      ? false
      : nsfw && (!showNsfw || !authenticatedDID) && !showNsfwContent;

  const showLoginModal = () => {
    navigateToModal({
      name: 'login',
      message: 'To view explicit or sensitive content, please connect to confirm your consent.',
    });
  };

  useEffect(() => {
    _onBlockInfoChange.current?.({ appName: APP_NAME_TO_DISPLAY_NAME_MAP[appName], blockName });
  }, [appName, blockName]);

  return (
    <ContentBlockExtension
      hideContent={showNSFWCard}
      readMode={{ blockID }}
      mode={ContentBlockModes.READONLY}
    >
      {({ blockData, blockInfo }) => {
        return (
          <BlockWrapper
            addBlockData={() => addBlockData(hasOwn(blockData, 'id') ? blockData : null)}
            addBlockInfo={() => addBlockInfo(blockInfo)}
          >
            <Stack
              justify="center"
              direction="row"
              background={{ light: 'grey9', dark: 'grey5' }}
              customStyle="rounded-[10px]"
            >
              {/* showHiddenContent is the flag used to hide nsfw blocks in the
               * feed when NSFW settings is off and shows the overlay over it when
               * on beam page (default to true in BeamSection(beam page), otherwise false)
               *  */}
              {showHiddenContent && showNSFWCard && (
                <Card
                  background={{ light: 'white', dark: 'grey3' }}
                  elevation="2"
                  margin="m-3.5"
                  padding="p-2"
                  customStyle="w-fit h-[60px]"
                >
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
              )}
            </Stack>
          </BlockWrapper>
        );
      }}
    </ContentBlockExtension>
  );
};

type BlockWrapperProps = {
  addBlockData: () => void;
  addBlockInfo: () => void;
};
const BlockWrapper: React.FC<PropsWithChildren<BlockWrapperProps>> = ({
  addBlockData,
  addBlockInfo,
  children,
}) => {
  useEffect(() => {
    addBlockData();
    addBlockInfo();
  }, [addBlockData, addBlockInfo]);
  return <>{children}</>;
};

//@TODO fetch app's display name from content block hook
const APP_NAME_TO_DISPLAY_NAME_MAP = {
  '@akashaorg/app-akasha-integration': 'Antenna',
};

export default ContentBlock;
