import React, { useEffect, useMemo, useRef, useState } from 'react';
import NSFW from '@akashaorg/design-system-components/lib/components/Entry/NSFW';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { hasOwn, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { useGetContentBlockByIdQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

type ContentBlockType = {
  blockID: string;
  authenticatedDID: string;
  showHiddenContent: boolean;
  onBlockInfoChange?: (blockInfo: { blockName: string; appName: string }) => void;
};
const ContentBlock: React.FC<ContentBlockType> = props => {
  const { blockID, authenticatedDID, showHiddenContent, onBlockInfoChange } = props;
  const { t } = useTranslation('ui-lib-feed');
  const contentBlockReq = useGetContentBlockByIdQuery({
    variables: { id: blockID },
  });
  const { navigateToModal } = useRootComponentProps();
  const [showNsfwContent, setShowNsfwContent] = useState(false);
  const _onBlockInfoChange = useRef(onBlockInfoChange);
  const blockData = useMemo(() => {
    return contentBlockReq.data?.node && hasOwn(contentBlockReq.data.node, 'id')
      ? contentBlockReq.data.node
      : null;
  }, [contentBlockReq.data]);
  const blockName = blockData?.content?.[0]?.propertyType;
  const appName = blockData?.content?.[0]?.label;
  const showNSFWCard = blockData?.nsfw && (!showNsfwContent || !authenticatedDID);

  const showLoginModal = () => {
    navigateToModal({ name: 'login' });
  };

  useEffect(() => {
    _onBlockInfoChange.current?.({
      appName: APP_NAME_TO_DISPLAY_NAME_MAP[appName],
      blockName,
    });
  }, [appName, blockName]);

  return (
    <>
      {!showNSFWCard && (
        <ContentBlockExtension readMode={{ blockData }} mode={ContentBlockModes.READONLY} />
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
    </>
  );
};

//@TODO fetch app's display name from content block hook
const APP_NAME_TO_DISPLAY_NAME_MAP = {
  '@akashaorg/app-akasha-integration': 'Antenna',
};

export default ContentBlock;
