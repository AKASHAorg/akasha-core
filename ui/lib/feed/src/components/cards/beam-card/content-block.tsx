import React, { useState } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import NSFWBlock from './nsfw-block';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useNsfwToggling } from '@akashaorg/ui-awf-hooks';

type ContentBlockType = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean /*@TODO: better use apollo filters than this flag to filter our block content */;
};
const ContentBlock: React.FC<ContentBlockType> = props => {
  const { blockID, authenticatedDID, showHiddenContent } = props;
  const { t } = useTranslation('ui-lib-feed');

  /*   get user's NSFW settings from the hook
   */
  const { showNsfw } = useNsfwToggling();

  /*   internal state for showing the NSFW content behind the overlay, default to false
   */
  const [showNsfwContent, setShowNsfwContent] = useState(false);
  /*   flag that will get updated with real nsfw property from the block
   * (through the onNsfwChange function call)
   */
  const [nsfw, setNsfw] = useState(false);
  const { navigateToModal } = useRootComponentProps();

  /* Show NSFW card (overlay) only when all the following conditions are met:
   * 1. The block is marked as NSFW
   * 2. The user toggled off NSFW content in their settings
   * 3. The user is not logged in or the showNsfwContent is false
   */
  const showNSFWCard = nsfw && !showNsfw && (!showNsfwContent || !authenticatedDID);

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  return (
    <ContentBlockExtension
      hideContent={showNSFWCard}
      readMode={{ blockID }}
      mode={ContentBlockModes.READONLY}
    >
      {blockData => {
        const nsfw = blockData && hasOwn(blockData, 'id') ? blockData.nsfw : false;
        return (
          <NSFWBlock
            nsfw={nsfw}
            onNsfwChange={() => {
              setNsfw(nsfw);
            }}
          >
            {/* showHiddenContent is the flag used to hide nsfw blocks in the
             * feed when NSFW settings is off and shows the overlay over it when
             * on beam page (default to true in BeamSection(beam page), otherwise false)
             *  */}
            {showHiddenContent && showNSFWCard && (
              <Card
                background={{ light: 'white', dark: 'grey3' }}
                elevation="2"
                margin="my-3.5"
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
          </NSFWBlock>
        );
      }}
    </ContentBlockExtension>
  );
};

export default ContentBlock;
