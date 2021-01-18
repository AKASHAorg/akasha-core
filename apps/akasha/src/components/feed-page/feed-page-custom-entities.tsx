import * as React from 'react';
import EntryCardRenderer from './entry-card-renderer';

export interface IGetCustomEntitiesProps {
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  handleEditorPlaceholderClick?: () => void;
  pendingEntries?: any[];
}

export const getFeedCustomEntities = (props: IGetCustomEntitiesProps) => {
  const { feedItems, pendingEntries = [] } = props;

  let customEntities: any = [];
  console.log(feedItems, 'the feed items');

  if (pendingEntries.length) {
    customEntities = customEntities.concat(
      pendingEntries.map((entry, idx) => ({
        position: 'before',
        itemId: feedItems.length ? feedItems[0] : null,
        getComponent: ({ key, style }: { key: string; style: React.CSSProperties }) => (
          <EntryCardRenderer
            key={`${entry.author.ethAddress}-${idx}-${key}`}
            style={{ ...style, backgroundColor: '#4e71ff0f' }}
            itemData={entry}
            onFollow={() => {}}
            onUnfollow={() => {}}
            onBookmark={() => {}}
            onNavigate={() => {}}
            onRepliesClick={() => {}}
            onFlag={() => () => {}}
            onShare={() => {}}
            onRepost={() => {}}
            onAvatarClick={() => {}}
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
