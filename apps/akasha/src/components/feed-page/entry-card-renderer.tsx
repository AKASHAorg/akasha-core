import React from 'react';
import DS from '@akashaproject/design-system';
import { useTranslation } from 'react-i18next';
import { useFollow } from '@akashaproject/ui-awf-hooks';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import routes, { POST } from '../../routes';
import { EventTypes, ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { usePost } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';
import { mapEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';

const { ErrorLoader, EntryCard, EntryCardHidden, EntryCardLoading, ExtensionPoint } = DS;

export interface IEntryCardRendererProps {
  itemId?: string;
  itemData?: IEntryData;
  isBookmarked?: boolean;
  locale?: ILocale;
  ethAddress: string | null;
  onBookmark: (entryId: string) => void;
  onNavigate: (details: IContentClickDetails) => void;
  onLinkCopy?: () => void;
  onFlag?: (entryId: string, contentType: string) => () => void;
  onRepost: (withComment: boolean, entryId: string) => void;
  sharePostUrl: string;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (pubKey: string) => void;
  onTagClick: (name: string) => void;
  singleSpaNavigate: (url: string) => void;
  bookmarkState?: any;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  disableActions?: boolean;
  hidePublishTime?: boolean;
  headerTextLabel?: string;
  footerTextLabel?: string;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  onEntryRemove?: (entryId: string) => void;
  removeEntryLabel?: string;
  removedByMeLabel?: string;
  removedByAuthorLabel?: string;
  uiEvents?: RootComponentProps['uiEvents'];
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    ethAddress,
    locale,
    bookmarkState,
    itemId,
    style,
    contentClickable,
    hidePublishTime,
    headerTextLabel,
    footerTextLabel,
    moderatedContentLabel,
    ctaLabel,
    disableActions,
    sharePostUrl,
  } = props;

  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);

  const { t } = useTranslation();
  const postReq = usePost({ postId: itemId, enabler: !!itemId });

  const isBookmarked = React.useMemo(() => {
    if (
      bookmarkState &&
      !bookmarkState.isFetching &&
      itemId &&
      bookmarkState.data?.findIndex(bm => bm.entryId === itemId) >= 0
    ) {
      return true;
    }

    return false;
  }, [bookmarkState, itemId]);

  const itemData = React.useMemo(() => {
    if (postReq.data) {
      return mapEntry(postReq.data);
    }
    return undefined;
  }, [postReq.data]);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return postReq.status === 'success' && itemData?.reported;
  }, [itemData, showAnyway, postReq.status]);

  const [followedProfiles, followActions] = useFollow({});

  const isFollowing = React.useMemo(() => {
    if (itemData?.author.ethAddress) {
      return followedProfiles.includes(itemData.author.ethAddress);
    }
    // defaults to false
    return false;
  }, [followedProfiles, itemData]);

  // React.useEffect(() => {
  //   if (ethAddress && itemData.author.ethAddress) {
  //     followActions.isFollowing(ethAddress, itemData.author.ethAddress);
  //   }
  // }, [ethAddress, itemData.author.ethAddress]);

  const handleFollow = () => {
    if (itemData?.author.ethAddress) {
      followActions.follow(itemData.author.ethAddress);
    }
  };

  const handleUnfollow = () => {
    if (itemData?.author.ethAddress) {
      followActions.unfollow(itemData.author.ethAddress);
    }
  };

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const onEditButtonMount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: ItemTypes.ENTRY,
      },
    });
  };

  const onEditButtonUnmount = (name: string) => {
    props.uiEvents.next({
      event: EventTypes.ExtensionPointMount,
      data: {
        name,
        entryId: itemId,
        entryType: ItemTypes.ENTRY,
      },
    });
  };

  return (
    <>
      {postReq.status === 'loading' && <EntryCardLoading />}
      {postReq.status === 'error' && (
        <ErrorLoader
          type="script-error"
          title={t('There was an error loading the entry')}
          details={t('We cannot show this entry right now')}
          devDetails={postReq.error}
        />
      )}
      {postReq.status === 'success' && (
        <>
          {itemData.moderated && itemData.delisted && (
            <EntryCardHidden moderatedContentLabel={moderatedContentLabel} isDelisted={true} />
          )}
          {!itemData.moderated && isReported && (
            <EntryCardHidden
              reason={itemData.reason}
              headerTextLabel={headerTextLabel}
              footerTextLabel={footerTextLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard}
            />
          )}
          {!isReported && (
            <EntryCard
              isRemoved={
                itemData.content.length === 1 && itemData.content[0].property === 'removed'
              }
              isBookmarked={isBookmarked}
              entryData={itemData}
              sharePostLabel={t('Share Post')}
              shareTextLabel={t('Share this post with your friends')}
              sharePostUrl={sharePostUrl}
              onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
                props.onAvatarClick(ev, itemData.author.pubKey)
              }
              onEntryBookmark={props.onBookmark}
              repliesLabel={t('Replies')}
              repostsLabel={t('Reposts')}
              repostLabel={t('Repost')}
              repostWithCommentLabel={t('Repost with comment')}
              shareLabel={t('Share')}
              copyLinkLabel={t('Copy Link')}
              flagAsLabel={t('Report Post')}
              loggedProfileEthAddress={ethAddress}
              locale={locale || 'en'}
              style={{ height: 'auto', ...style }}
              bookmarkLabel={t('Save')}
              bookmarkedLabel={t('Saved')}
              profileAnchorLink={'/profile'}
              repliesAnchorLink={routes[POST]}
              onRepost={props.onRepost}
              onEntryFlag={props.onFlag && props.onFlag(itemData.entryId, 'post')}
              handleFollowAuthor={handleFollow}
              handleUnfollowAuthor={handleUnfollow}
              isFollowingAuthor={isFollowing}
              onContentClick={props.onNavigate}
              onMentionClick={props.onMentionClick}
              onTagClick={props.onTagClick}
              singleSpaNavigate={props.singleSpaNavigate}
              contentClickable={contentClickable}
              hidePublishTime={hidePublishTime}
              headerTextLabel={headerTextLabel}
              footerTextLabel={footerTextLabel}
              moderatedContentLabel={moderatedContentLabel}
              ctaLabel={ctaLabel}
              handleFlipCard={handleFlipCard}
              disableActions={disableActions}
              onEntryRemove={props.onEntryRemove}
              removeEntryLabel={props.removeEntryLabel}
              removedByMeLabel={props.removedByMeLabel}
              removedByAuthorLabel={props.removedByAuthorLabel}
              headerMenuExt={
                ethAddress === itemData.author.ethAddress && (
                  <ExtensionPoint
                    name={`entry-card-edit-button_${itemId}`}
                    onMount={onEditButtonMount}
                    onUnmount={onEditButtonUnmount}
                  />
                )
              }
            />
          )}
        </>
      )}
    </>
  );
};

export default EntryCardRenderer;
