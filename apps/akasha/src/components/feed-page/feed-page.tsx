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
import { ILoginState } from '@akashaproject/ui-awf-hooks/lib/use-login-state';
import FeedWidget from '@akashaproject/ui-widget-feed/lib/components/entry-feed';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ENTRY_KEY } from '@akashaproject/ui-awf-hooks/lib/use-posts.new';

import routes, { POST } from '../../routes';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';
import { ItemTypes } from '@akashaproject/ui-awf-typings/lib/app-loader';

const { Box, Helmet, EditorPlaceholder, EntryCard, EntryPublishErrorCard } = DS;

export interface FeedPageProps {
  singleSpa: any;
  logger: any;
  showLoginModal: (redirectTo?: ModalNavigationOptions) => void;
  loggedProfileData?: IProfileData;
  loginState: ILoginState;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { showLoginModal, loggedProfileData, loginState, logger } = props;

  const queryClient = useQueryClient();
  const { t, i18n } = useTranslation();
  const locale = (i18n.languages[0] || 'en') as ILocale;

  const [errorState] = useErrors({ logger });

  const createPostMutation = useMutationListener<IPublishData>(CREATE_POST_MUTATION_KEY);

  const postsReq = useInfinitePosts(15);

  React.useEffect(() => {
    if (Object.keys(errorState).length) {
      logger.error(errorState);
    }
  }, [errorState, logger]);

  //@Todo: replace this with fetchNextPage() from useInfinitePosts object
  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage && loginState.currentUserCalled) {
      postsReq.fetchNextPage();
    }
  }, [postsReq, loginState.currentUserCalled]);

  const postPages = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const handleNavigation = (itemType: ItemTypes, details: IContentClickDetails) => {
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
  };

  const handleShowEditor = () => {
    props.navigateToModal({ name: 'editor' });
  };

  const handleEntryFlag = (entryId: string, contentType: string) => () => {
    if (!loginState.pubKey) {
      return showLoginModal({ name: 'report-modal', entryId, contentType });
    }
    props.navigateToModal({ name: 'report-modal', entryId, contentType });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      {loginState.ethAddress && (
        <EditorPlaceholder
          ethAddress={loginState.ethAddress}
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
          entryData={createPendingEntry(
            loggedProfileData,
            createPostMutation.state.variables,
            createPostMutation.state.variables.metadata.quote,
          )}
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
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
        />
      )}
      <FeedWidget
        itemType={ItemTypes.ENTRY}
        logger={logger}
        onLoadMore={handleLoadMore}
        pages={postPages}
        getShareUrl={(itemId: string) => `${window.location.origin}/social-app/post/${itemId}`}
        requestStatus={postsReq.status}
        ethAddress={loginState.ethAddress}
        onNavigate={handleNavigation}
        singleSpaNavigate={props.singleSpa.navigateToUrl}
        navigateToModal={props.navigateToModal}
        onLoginModalOpen={showLoginModal}
        hasNextPage={postsReq.hasNextPage}
        profilePubKey={loginState.pubKey}
        loggedProfile={loggedProfileData}
        contentClickable={true}
        onEntryFlag={handleEntryFlag}
        uiEvents={props.uiEvents}
        itemSpacing={8}
        i18n={i18n}
      />
    </Box>
  );
};

export default FeedPage;
