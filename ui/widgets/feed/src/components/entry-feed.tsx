import * as React from 'react';
import DS from '@akashaproject/design-system';
import { IFeedWidgetProps, ItemTypes } from './App';
import { useErrors, useFollow, useBookmarks, useLoginState } from '@akashaproject/ui-awf-hooks';
import EntryRenderer from './entry-renderer';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaproject/design-system/src/utils/time';
import { uploadMediaToTextile } from '../utils/media-utils';

const { VirtualList, ErrorInfoCard, ErrorLoader, EditorModal } = DS;

const EntryFeed = (props: IFeedWidgetProps) => {
  const { errors } = props;
  const [errorState, errorActions] = useErrors({ logger: props.logger });
  const { t, i18n } = useTranslation('ui-widget-feed');

  const [loginState] = useLoginState({
    profileService: props.sdkModules.profiles.profileService,
    ipfsService: props.sdkModules.commons.ipfsService,
    onError: errorActions.createError,
    authService: props.sdkModules.auth.authService,
    globalChannel: props.globalChannel,
  });

  const [currentEmbedEntry, setCurrentEmbedEntry] = React.useState(undefined);
  const [showEditor, setShowEditor] = React.useState<boolean>(false);

  const [followedProfiles, followActions] = useFollow({
    globalChannel: props.globalChannel,
    profileService: props.sdkModules.profiles.profileService,
    onError: errorActions.createError,
  });

  const [bookmarkState, bookmarkActions] = useBookmarks({
    dbService: props.sdkModules.db,
    onError: errorActions.createError,
  });

  React.useEffect(() => {
    if (loginState.waitForAuth && !loginState.ready) {
      return;
    }
    if ((loginState.waitForAuth && loginState.ready) || loginState.currentUserCalled) {
      bookmarkActions.getBookmarks();
    }
  }, [JSON.stringify(loginState)]);

  const handleBookmark = (isBookmarked: boolean, entryId: string) => {
    if (props.loggedProfile.pubKey) {
      if (props.itemType === ItemTypes.COMMENT) {
        if (!isBookmarked) {
          return bookmarkActions.bookmarkComment(entryId);
        }
        return bookmarkActions.removeBookmark(entryId);
      }
      if (props.itemType === ItemTypes.ENTRY) {
        if (!isBookmarked) {
          return bookmarkActions.bookmarkPost(entryId);
        }
        return bookmarkActions.removeBookmark(entryId);
      }
    } else {
      props.onLoginModalOpen();
    }
  };
  const handleRepost = (_withComment: boolean, entryData: any) => {
    if (!props.loggedProfile.pubKey) {
      props.onLoginModalOpen();
    } else {
      setCurrentEmbedEntry(entryData);
      setShowEditor(true);
    }
  };
  const locale: any = i18n.languages[0];

  const onUploadRequest = uploadMediaToTextile(
    props.sdkModules.profiles.profileService,
    props.sdkModules.commons.ipfsService,
  );

  const [tags, setTags] = React.useState([]);

  const handleGetTags = (query: string) => {
    const tagsService = props.sdkModules.posts.tags.searchTags({ tagName: query });
    tagsService.subscribe((resp: any) => {
      if (resp.data?.searchTags) {
        const filteredTags = resp.data.searchTags;
        setTags(filteredTags);
      }
    });
  };

  const [mentions, setMentions] = React.useState([]);
  const handleGetMentions = (query: string) => {
    const mentionsService = props.sdkModules.profiles.profileService.searchProfiles({
      name: query,
    });
    mentionsService.subscribe((resp: any) => {
      if (resp.data?.searchProfiles) {
        const filteredMentions = resp.data.searchProfiles;
        setMentions(filteredMentions);
      }
    });
  };

  const handleToggleEditor = () => {
    setShowEditor(prev => !prev);
    setCurrentEmbedEntry(undefined);
  };

  const handleEntryPublish = (entryData: any) => {
    if (!props.loggedProfile.ethAddress && !props.loggedProfile.pubKey) {
      props.onLoginModalOpen();
      return;
    }

    if (props.onRepostPublish) {
      props.onRepostPublish(entryData, currentEmbedEntry);
      setShowEditor(false);
    }
  };
  const hasMoreItems = React.useMemo(() => {
    if (props.totalItems && props.itemIds?.length) {
      return props.totalItems > props.itemIds.length;
    }
    // defaults to true,
    // meaning that the list will try to fetch
    // the first/next batch of items
    return true;
  }, [props.totalItems, props.itemIds?.length]);

  return (
    <ErrorInfoCard errors={{ ...errors, ...errorState }}>
      {(messages, hasCriticalErrors) => (
        <>
          {messages && (
            <ErrorLoader
              style={{ marginTop: '.5em' }}
              type="script-error"
              title={t('There was an error loading the list')}
              details={messages}
            />
          )}
          {showEditor && props.modalSlotId && (
            <EditorModal
              slotId={props.modalSlotId}
              avatar={props.loggedProfile.avatar}
              showModal={showEditor}
              ethAddress={props.loggedProfile.ethAddress}
              postLabel={t('Publish')}
              placeholderLabel={t('Write something')}
              discardPostLabel={t('Discard Post')}
              discardPostInfoLabel={t(
                "You have not posted yet. If you leave now you'll discard your post.",
              )}
              keepEditingLabel={t('Keep Editing')}
              onPublish={handleEntryPublish}
              handleNavigateBack={handleToggleEditor}
              getMentions={handleGetMentions}
              getTags={handleGetTags}
              tags={tags}
              mentions={mentions}
              uploadRequest={onUploadRequest}
              embedEntryData={currentEmbedEntry}
              style={{ width: '36rem' }}
            />
          )}
          {!hasCriticalErrors && (
            <VirtualList
              ref={props.virtualListRef}
              items={props.itemIds}
              itemsData={props.itemsData}
              loadMore={props.loadMore}
              loadItemData={props.loadItemData}
              listHeader={props.listHeader}
              hasMoreItems={hasMoreItems}
              itemCard={
                <EntryRenderer
                  pubKey={props.profilePubKey}
                  ethAddress={props.ethAddress}
                  itemType={props.itemType}
                  sharePostUrl={`${window.location.origin}/AKASHA-app/post/`}
                  locale={locale as ILocale}
                  bookmarkState={bookmarkState}
                  followedProfiles={followedProfiles}
                  checkIsFollowing={followActions.isFollowing}
                  onFollow={followActions.follow}
                  onUnfollow={followActions.unfollow}
                  onBookmark={handleBookmark}
                  onNavigate={props.onNavigate}
                  onReport={props.onReport}
                  onRepost={handleRepost}
                  contentClickable={props.contentClickable}
                  awaitingModerationLabel={t(
                    'You have reported this post. It is awaiting moderation.',
                  )}
                  moderatedContentLabel={t('This content has been moderated')}
                  ctaLabel={t('See it anyway')}
                  handleFlipCard={props.handleFlipCard}
                />
              }
            />
          )}
        </>
      )}
    </ErrorInfoCard>
  );
};

export default EntryFeed;
