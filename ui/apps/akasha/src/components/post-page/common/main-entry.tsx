import * as React from 'react';
import DS from '@akashaorg/design-system';

import {
  LoginState,
  useAnalytics,
  useEntryNavigation,
  useFollow,
  useIsFollowingMultiple,
  useUnfollow,
} from '@akashaorg/ui-awf-hooks';
import {
  EntityTypes,
  IEntryData,
  RootComponentProps,
  ModalNavigationOptions,
  AnalyticsCategories,
} from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import routes, { POST } from '../../../routes';
import { UseQueryResult } from 'react-query';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';

const { Box, EditorPlaceholder, EntryBox } = DS;

type Props = {
  entryId: string;
  entryType: EntityTypes;
  entryReq: UseQueryResult;
  loginState?: LoginState;
  uiEvents: RootComponentProps['uiEvents'];
  plugins: RootComponentProps['plugins'];
  singleSpa: RootComponentProps['singleSpa'];
  layoutConfig: RootComponentProps['layoutConfig'];
  entryData?: IEntryData;
  navigateToModal: RootComponentProps['navigateToModal'];
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

export function MainEntry({
  entryId,
  entryType,
  entryReq,
  loginState,
  uiEvents,
  plugins,
  singleSpa,
  layoutConfig,
  entryData,
  navigateToModal,
  showLoginModal,
}: Props) {
  const { t } = useTranslation('app-akasha-integration');

  const action = new URLSearchParams(location.search).get('action');
  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;
  const locale = (plugins['@akashaorg/app-translation']?.translation?.i18n?.languages?.[0] ||
    'en') as ILocale;
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const [analyticsActions] = useAnalytics();
  const handleEntryNavigate = useEntryNavigation(navigateTo, entryId);
  const followReq = useFollow();
  const unfollowReq = useUnfollow();

  const isFollowingMultipleReq = useIsFollowingMultiple(loginState?.pubKey, [
    entryData?.author?.pubKey,
  ]);
  const [showReplyEditor, setShowReplyEditor] = React.useState(true);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return entryReq.isSuccess && entryData?.reported;
  }, [entryData?.reported, showAnyway, entryReq.isSuccess]);

  const showEntry = React.useMemo(
    () => !entryData?.delisted && (!isReported || (isReported && entryData?.moderated)),
    [entryData?.delisted, entryData?.moderated, isReported],
  );

  const showEditButton = React.useMemo(
    () => loginState.isReady && loginState.ethAddress === entryData?.author?.ethAddress,
    [entryData?.author?.ethAddress, loginState.ethAddress, loginState.isReady],
  );

  if (!showEntry) return null;

  if (loginState?.ethAddress) {
    switch (action) {
      case 'repost':
        if (entryType !== EntityTypes.ENTRY) return;
        return (
          <Extension
            name={`inline-editor_repost_${entryData?.entryId}`}
            uiEvents={uiEvents}
            data={{ entryId, entryType, action: 'repost' }}
          />
        );
      case 'edit':
        return (
          <Extension
            name={`inline-editor_postedit_${entryData?.entryId}`}
            uiEvents={uiEvents}
            data={{ entryId, entryType, action: 'edit' }}
          />
        );
    }
  }

  const followedProfiles = isFollowingMultipleReq.data;

  const isFollowing = followedProfiles.includes(entryData?.author?.pubKey);

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, pubKey: string) => {
    ev.preventDefault();
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${pubKey}`,
    });
  };

  const handleRepost = (_withComment: boolean, entryId: string) => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Repost Clicked',
    });
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    } else {
      singleSpa.navigateToUrl(
        `${window.location.origin}/@akashaorg/app-akasha-integration/post/${entryId}?action=repost`,
      );
    }
  };

  const handleEntryFlag = (entryId: string, itemType: string) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', entryId, itemType } });
    }
    navigateToModal({ name: 'report-modal', entryId, itemType });
  };

  const handleFollow = () => {
    if (entryData?.author?.pubKey) {
      followReq.mutate(entryData?.author?.pubKey);
    }
  };

  const handleUnfollow = () => {
    if (entryData?.author?.pubKey) {
      unfollowReq.mutate(entryData?.author?.pubKey);
    }
  };

  const handleMentionClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  const handleFlipCard = () => {
    setShowAnyway(true);
  };

  const handlePostRemove = (commentId: string) => {
    navigateToModal({
      name: 'entry-remove-confirmation',
      entryType,
      entryId: commentId,
    });
  };

  const handlePlaceholderClick = () => {
    showLoginModal();
  };

  const replyActive = !action && loginState?.ethAddress;

  return (
    <Box
      round={{ corner: 'top', size: 'xsmall' }}
      background={{ color: replyActive ? 'entryBackground' : null }}
    >
      <Box
        border={
          replyActive
            ? null
            : {
                side: 'bottom',
                size: '1px',
                color: 'border',
              }
        }
      >
        <EntryBox
          isRemoved={entryData?.isRemoved}
          entryData={entryData}
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          sharePostUrl={`${window.location.origin}${routes[POST]}/`}
          onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
            handleAvatarClick(ev, entryData?.author?.pubKey)
          }
          repliesLabel={t('Replies')}
          repostLabel={t('Repost')}
          repostWithCommentLabel={t('Repost with comment')}
          shareLabel={t('Share')}
          copyLinkLabel={t('Copy Link')}
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={loginState.isReady && loginState?.ethAddress}
          locale={locale}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          onRepost={handleRepost}
          onEntryFlag={handleEntryFlag(entryData?.entryId, 'post')}
          handleFollowAuthor={handleFollow}
          handleUnfollowAuthor={handleUnfollow}
          isFollowingAuthor={isFollowing}
          onContentClick={handleEntryNavigate}
          navigateTo={navigateTo}
          contentClickable={true}
          onMentionClick={handleMentionClick}
          onTagClick={handleTagClick}
          moderatedContentLabel={t('This content has been moderated')}
          ctaLabel={t('See it anyway')}
          handleFlipCard={handleFlipCard}
          scrollHiddenContent={true}
          onEntryRemove={handlePostRemove}
          onRepliesClick={() => setShowReplyEditor(show => !show)}
          removeEntryLabel={t('Delete Post')}
          removedByMeLabel={t('You deleted this post')}
          removedByAuthorLabel={t('This post was deleted by its author')}
          disableReposting={entryData?.isRemoved || entryType === EntityTypes.COMMENT}
          hideRepost={entryType === EntityTypes.COMMENT}
          disableReporting={loginState.waitForAuth || loginState.isSigningIn}
          modalSlotId={layoutConfig.modalSlotId}
          headerMenuExt={
            showEditButton && (
              <Extension
                name={`entry-card-edit-button_${entryData?.entryId}`}
                style={{ width: '100%' }}
                uiEvents={uiEvents}
                data={{ entryId, entryType }}
              />
            )
          }
          actionsRightExt={
            <Extension
              name={`entry-card-actions-right_${entryData?.entryId}`}
              uiEvents={uiEvents}
              data={{
                entryId,
                entryType,
              }}
            />
          }
        />
      </Box>
      <Box margin="medium">
        {!loginState?.ethAddress && (
          <EditorPlaceholder onClick={handlePlaceholderClick} ethAddress={null} />
        )}
        {showReplyEditor && loginState?.ethAddress && !entryData?.isRemoved && (
          <Extension
            name={`inline-editor_postreply_${entryData?.entryId}`}
            uiEvents={uiEvents}
            data={{
              entryId,
              entryType,
              action: 'reply',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
