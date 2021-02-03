import * as React from 'react';
import EntryCardRenderer from './entry-card-renderer';

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
  const { feedItems, pendingEntries = [], sdkModules, logger, globalChannel } = props;

  let customEntities: any = [];

  if (pendingEntries.length) {
    customEntities = customEntities.concat(
      pendingEntries.map((entry, idx) => ({
        position: 'before',
        itemId: feedItems.length ? feedItems[0] : null,
        getComponent: ({ key, style }: { key: string; style: React.CSSProperties }) => (
          <EntryCardRenderer
            sdkModules={sdkModules}
            logger={logger}
            globalChannel={globalChannel}
            key={`${entry.author.ethAddress}-${idx}-${key}`}
            style={{ ...style, backgroundColor: 'rgba(78,113,255,0.01)' }}
            itemData={entry}
            onFollow={() => {
              /* not allowed */
            }}
            onUnfollow={() => {
              /* not allowed */
            }}
            onBookmark={() => {
              /* not allowed */
            }}
            onNavigate={() => {
              /* not allowed */
            }}
            onRepliesClick={() => {
              /* not allowed */
            }}
            onFlag={() => () => {
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
          />
        ),
      })),
    );
  }
  if (customEntities.length) {
    return customEntities;
  }
  return;
};
