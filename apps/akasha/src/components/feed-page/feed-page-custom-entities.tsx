import * as React from 'react';
import DS from '@akashaproject/design-system';
import type { TFunction } from 'i18next';
import type { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { uploadMediaToIpfs } from '../../services/posting-service';

const { EditorCard, EntryCard, styled, css } = DS;

export interface IGetCustomEntitiesProps {
  isMobile: boolean;
  feedItems: string[];
  loggedEthAddress: string | null;
  handlePublish: (ethAddress: string, content: any) => void;
  handleBackNavigation: () => void;
  handleGetTags: (query: string) => void;
  handleGetMentions: (query: string) => void;
  ipfsService?: any;
  pendingEntries: any[];
  t: TFunction;
  locale: ILocale;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onContentClick?: any;
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
    handlePublish,
    handleBackNavigation,
    handleGetTags,
    handleGetMentions,
    ipfsService,
    pendingEntries,
    t,
    locale,
    onAvatarClick,
    onContentClick,
  } = props;

  let customEntities = [];

  const onUploadRequest = uploadMediaToIpfs(ipfsService);

  if (!isMobile && loggedEthAddress) {
    customEntities.push({
      position: 'before',
      // itemIndex: 0,
      itemId: feedItems.length ? feedItems[0] : null,
      getComponent: ({ key, style }: { key: string; style: any }) => (
        <EditorCard
          ethAddress={loggedEthAddress}
          postLabel={t('Publish')}
          placeholderLabel={t('Write something')}
          onPublish={handlePublish}
          style={style}
          key={key}
          handleNavigateBack={handleBackNavigation}
          getMentions={handleGetMentions}
          getTags={handleGetTags}
          uploadRequest={onUploadRequest}
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
