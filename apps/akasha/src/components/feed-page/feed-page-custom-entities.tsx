import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { TFunction } from 'i18next';
import type { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { EditorPlaceholder, EntryCard, styled, css } = DS;

export interface IGetCustomEntitiesProps {
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  pendingEntries: any[];
  t: TFunction;
  locale: ILocale;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onContentClick?: any;
  handleEditorPlaceholderClick?: () => void;
}

const CustomEntryCard = styled(EntryCard)<{ isPending: boolean }>`
  ${props => css`
    background-color: ${props.isPending
      ? props.theme.colors.ultraLightBackground
      : props.theme.colors.background};
  `}
`;

export const getFeedCustomEntities = (props: IGetCustomEntitiesProps) => {
  const {
    isMobile,
    feedItems,
    loggedEthAddress,
    pendingEntries,
    t,
    locale,
    onAvatarClick,
    onContentClick,
    handleEditorPlaceholderClick,
  } = props;

  let customEntities = [];

  if (!isMobile && loggedEthAddress) {
    customEntities.push({
      position: 'before',
      // itemIndex: 0,
      itemId: feedItems.length ? feedItems[0] : null,
      getComponent: ({ key, style }: { key: string; style: any }) => (
        <EditorPlaceholder
          key={key}
          ethAddress={loggedEthAddress}
          onClick={handleEditorPlaceholderClick}
          style={style}
        />
      ),
    });
  }
  if (pendingEntries.length && loggedEthAddress) {
    const entriesToPrepend = pendingEntries.map(pendingEntry => ({
      position: 'before',
      itemId: feedItems.length ? feedItems[0] : null,
      getComponent: ({ style }: { key: string; style: any }) => (
        <CustomEntryCard
          isPending={true}
          style={{ ...style, height: 'auto' }}
          key={pendingEntry.localId}
          entryData={pendingEntry.entry}
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          sharePostUrl={'https://ethereum.world'}
          onClickAvatar={ev => onAvatarClick(ev, pendingEntry.entry.author.ethAddress)}
          // onEntryBookmark={handleEntryBookmark}
          repliesLabel={t('Replies')}
          repostsLabel={t('Reposts')}
          repostLabel={t('Repost')}
          repostWithCommentLabel={t('Repost with comment')}
          shareLabel={t('Share')}
          copyLinkLabel={t('Copy Link')}
          copyIPFSLinkLabel={t('Copy IPFS Link')}
          flagAsLabel={t('Flag as inappropiate')}
          loggedProfileEthAddress={loggedEthAddress}
          locale={locale}
          bookmarkLabel={t('Save')}
          bookmarkedLabel={t('Saved')}
          onRepost={() => null}
          onEntryShare={() => null}
          onEntryFlag={() => null}
          onLinkCopy={() => null}
          onClickReplies={() => null}
          handleFollow={() => null}
          handleUnfollow={() => null}
          onContentClick={onContentClick}
        />
      ),
    }));
    customEntities = customEntities.concat(entriesToPrepend);
  }
  if (customEntities.length) {
    return customEntities;
  }
  return;
};
