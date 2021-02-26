import * as React from 'react';
import EntryCardRenderer from './entry-card-renderer';
import DS from '@akashaproject/design-system';

const { EntryPublishErrorCard } = DS;
export interface IGetCustomEntitiesProps {
  sdkModules: any;
  logger: any;
  globalChannel: any;
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  handleEditorPlaceholderClick?: () => void;
  pendingEntries?: any[];
}

export const getFeedCustomEntities = (props: IGetCustomEntitiesProps) => {
  const {
    feedItems,
    pendingEntries = [],
    sdkModules,
    logger,
    globalChannel,
    loggedEthAddress,
  } = props;

  let customEntities: any = [];

  if (pendingEntries.length) {
    customEntities = customEntities.concat(
      pendingEntries.map((entry, idx) => ({
        position: 'before',
        itemId: feedItems.length ? feedItems[0] : null,
        getComponent: ({ key, style }: { key: string; style: React.CSSProperties }) => (
          <>
            {entry.error && (
              <EntryPublishErrorCard message={entry.error} style={{ marginBottom: '0.5em' }} />
            )}
            {!entry.error && (
              <EntryCardRenderer
                hidePublishTime={true}
                sdkModules={sdkModules}
                logger={logger}
                globalChannel={globalChannel}
                ethAddress={loggedEthAddress}
                key={`${entry.author.ethAddress}-${idx}-${key}`}
                style={{ ...style, backgroundColor: '#4e71ff0f' }}
                itemData={entry}
                onBookmark={() => {
                  /* not allowed */
                }}
                onNavigate={() => {
                  /* not allowed */
                }}
                onRepliesClick={() => {
                  /* not allowed */
                }}
                onShare={() => {
                  /* not allowed */
                }}
                onRepost={() => {
                  /* not allowed */
                }}
                onAvatarClick={() => {
                  /* not allowed */
                }}
                onMentionClick={() => {
                  /* not allowed */
                }}
                disableIpfsCopyLink={true}
              />
            )}
          </>
        ),
      })),
    );
  }
  if (customEntities.length) {
    return customEntities;
  }
  return;
};
