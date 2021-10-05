import * as React from 'react';
import { useQueryClient } from 'react-query';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { RootComponentProps } from '@akashaproject/ui-awf-typings';
import { IPublishData } from '@akashaproject/ui-awf-typings/lib/entry';
import { useErrors } from '@akashaproject/ui-awf-hooks';
import {
  useInfinitePosts,
  CREATE_POST_MUTATION_KEY,
} from '@akashaproject/ui-awf-hooks/lib/use-posts.new';

import { useMutationListener } from '@akashaproject/ui-awf-hooks/lib/use-query-listener';
import { createPendingEntry } from '@akashaproject/ui-awf-hooks/lib/utils/entry-utils';
import { ModalNavigationOptions } from '@akashaproject/ui-awf-typings/lib/app-loader';
import { LoginState } from '@akashaproject/ui-awf-hooks/lib/use-login.new';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/App';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ENTRY_KEY } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';

import routes, { POST } from '../../routes';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { Box, Helmet, EditorPlaceholder, EntryCard, EntryPublishErrorCard } = DS;

export interface FeedPageProps {
  showLoginModal: (redirectTo?: ModalNavigationOptions) => void;
  loggedProfileData?: IProfileData;
  loginState: LoginState;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData, loginState } = props;

  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [errorState] = useErrors({ logger });

  const createPostMutation = useMutationListener<IPublishData>(CREATE_POST_MUTATION_KEY);

  const postsReq = useInfinitePosts(15);

  const navigateToModal = React.useRef(props.navigateToModal);
  const showLoginModal = React.useRef(props.showLoginModal);

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(JSON.stringify(errorState));
    }
  }, [errorState, logger]);

  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage && loginState?.fromCache) {
      postsReq.fetchNextPage();
    }
  }, [postsReq, loginState?.fromCache]);

  const postPages = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const handleNavigation = React.useCallback(
    (itemType: ItemTypes, details: IContentClickDetails) => {
      let url;
      switch (itemType) {
        case ItemTypes.PROFILE:
          url = `/profile/${details.entryId}`;
          break;
        case ItemTypes.TAG:
          url = `/social-app/tags/${details.entryId}`;
          break;
        case ItemTypes.ENTRY:
          url = `/social-app/post/${details.entryId}`;
          break;
        case ItemTypes.COMMENT:
          /* Navigate to parent post because we don't have the comment page yet */
          url = `/social-app/post/${
            queryClient.getQueryData<{ postId: string }>([ENTRY_KEY, details.entryId]).postId
          }`;
          break;
        default:
          break;
      }
      props.singleSpa.navigateToUrl(url);
    },
    [queryClient, props.singleSpa],
  );

  const handleShowEditor = React.useCallback(() => {
    navigateToModal.current({ name: 'editor' });
  }, []);

  const handleEntryFlag = React.useCallback(
    (entryId: string, itemType: string) => () => {
      if (!loginState.pubKey) {
        return showLoginModal.current({ name: 'report-modal', entryId, itemType });
      }
      navigateToModal.current({ name: 'report-modal', entryId, itemType });
    },
    [loginState.pubKey],
  );

  const handleEntryRemove = React.useCallback((entryId: string) => {
    navigateToModal.current({
      name: 'entry-remove-confirmation',
      entryType: ItemTypes.ENTRY,
      entryId,
    });
  }, []);

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      {loginState?.ethAddress && (
        <EditorPlaceholder
          ethAddress={loginState?.ethAddress}
          onClick={handleShowEditor}
          avatar={loggedProfileData?.avatar}
          style={{ marginBottom: '0.5rem' }}
        />
      )}
      {createPostMutation && createPostMutation.state.status === 'error' && (
        <EntryPublishErrorCard message={t('Cannot publish this entry. Please try again later!')} />
      )}
      {createPostMutation && createPostMutation.state.status === 'loading' && (
        <EntryCard
          style={{ backgroundColor: '#4e71ff0f', marginBottom: '0.5rem' }}
          entryData={createPendingEntry(loggedProfileData, createPostMutation.state.variables)}
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          repliesLabel={t('Replies')}
          repostsLabel={t('Reposts')}
          repostLabel={t('Repost')}
          repostWithCommentLabel={t('Repost with comment')}
          shareLabel={t('Share')}
          copyLinkLabel={t('Copy Link')}
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={loggedProfileData.ethAddress}
          locale={locale || 'en'}
          bookmarkLabel={t('Save')}
          bookmarkedLabel={t('Saved')}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
        />
      )}
      <FeedWidget
        logger={logger}
        itemType={ItemTypes.ENTRY}
        pages={postPages}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        loginState={loginState}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={props.showLoginModal}
        requestStatus={postsReq.status}
        hasNextPage={postsReq.hasNextPage}
        loggedProfile={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        onEntryRemove={handleEntryRemove}
        removeEntryLabel={t('Delete Post')}
        removedByMeLabel={t('You deleted this post')}
        removedByAuthorLabel={t('This post was deleted by its author')}
        uiEvents={props.uiEvents}
        itemSpacing={8}
        i18n={i18n}
      />
    </Box>
  );
};

export default FeedPage;
