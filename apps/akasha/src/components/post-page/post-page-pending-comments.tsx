import * as React from 'react';
import PostRenderer from './post-renderer';

export interface IGetCustomEntitiesProps {
  sdkModules: any;
  logger: any;
  globalChannel: any;
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  handleEditorPlaceholderClick?: () => void;
  pendingComments?: any[];
  locale: string;
}

export const getPendingComments = (props: IGetCustomEntitiesProps) => {
  const { feedItems, pendingComments = [], locale, sdkModules, logger, globalChannel } = props;

  let customEntities: any = [];

  if (pendingComments.length) {
    customEntities = customEntities.concat(
      pendingComments.map((entry, idx) => ({
        position: 'before',
        itemId: feedItems.length ? feedItems[0] : null,
        getComponent: ({ key, style }: { key: string; style: React.CSSProperties }) => (
          <PostRenderer
            sdkModules={sdkModules}
            logger={logger}
            globalChannel={globalChannel}
            key={`${entry.author.ethAddress}-${idx}-${key}`}
            style={{ ...style, backgroundColor: '#4e71ff0f' }}
            itemData={entry}
            locale={locale}
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
