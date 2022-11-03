import * as React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/lib/utils/time';
import {
  ModalNavigationOptions,
  IPublishData,
  RootComponentProps,
  IProfileData,
  EntityTypes,
  AnalyticsCategories,
} from '@akashaorg/typings/ui';
import {
  useInfinitePosts,
  CREATE_POST_MUTATION_KEY,
  useMutationListener,
  createPendingEntry,
  LoginState,
  useAnalytics,
} from '@akashaorg/ui-awf-hooks';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';
import FeedWidget from '@akashaorg/ui-lib-feed/lib/components/App';
import routes, { POST } from '../../routes';

const { Box, Helmet, EntryCard, EntryPublishErrorCard, LoginCTAWidgetCard, BasicCardBox, Text } =
  DS;

export interface FeedPageProps {
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
  /* @Todo: Fix my type */
  loggedProfileData?: any;
  loginState: LoginState;
}

const FeedPage: React.FC<FeedPageProps & RootComponentProps> = props => {
  const { logger, loggedProfileData, loginState } = props;

  const { t } = useTranslation('app-akasha-integration');
  const locale = (props.plugins['@akashaorg/app-translation']?.translation?.i18n?.languages?.[0] ||
    'en') as ILocale;

  const [analyticsActions] = useAnalytics();

  const { mutation: createPostMutation } =
    useMutationListener<IPublishData>(CREATE_POST_MUTATION_KEY);

  const postsReq = useInfinitePosts(15);

  const navigateToModal = React.useRef(props.navigateToModal);
  const showLoginModal = React.useRef(props.showLoginModal);

  const handleLoadMore = React.useCallback(() => {
    if (!postsReq.isLoading && postsReq.hasNextPage && loginState?.fromCache) {
      postsReq.fetchNextPage();
    }
  }, [postsReq, loginState?.fromCache]);

  /* @Todo: Fix my type */
  const postPages: any = React.useMemo(() => {
    if (postsReq.data) {
      return postsReq.data.pages;
    }
    return [];
  }, [postsReq.data]);

  const handleEntryFlag = React.useCallback(
    (entryId: string, itemType: string) => () => {
      if (!loginState.pubKey) {
        return showLoginModal.current({ modal: { name: 'report-modal', entryId, itemType } });
      }
      navigateToModal.current({ name: 'report-modal', entryId, itemType });
    },
    [loginState.pubKey],
  );

  const handleEntryRemove = React.useCallback((entryId: string) => {
    navigateToModal.current({
      name: 'entry-remove-confirmation',
      entryType: EntityTypes.ENTRY,
      entryId,
    });
  }, []);

  const handleWriteToUsLabelClick = () => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.INVITATION_CODE,
      action: 'Request',
      name: 'Feed',
    });
  };

  return (
    <Box fill="horizontal">
      <Helmet>
        <title>Ethereum World</title>
      </Helmet>
      {loginState?.ethAddress ? (
        <>
          <BasicCardBox pad="medium" gap="xsmall" margin={{ bottom: 'xsmall' }}>
            <Box fill="horizontal">
              <Text size="xlarge" weight="bold">
                {t('General Social Feed')}
              </Text>
            </Box>
            <Text color="grey">{t("Check what's up from your fellow Ethereans ✨")}</Text>
          </BasicCardBox>
          <Box margin={{ bottom: 'xsmall' }}>
            <Extension
              name="inline-editor_feed_page"
              uiEvents={props.uiEvents}
              data={{ action: 'post' }}
            />
          </Box>
        </>
      ) : (
        <Box margin={{ bottom: 'small' }}>
          <LoginCTAWidgetCard
            title={`${t('Welcome, fellow Ethereans!')} 💫`}
            subtitle={t('We are in private alpha at this time. ')}
            beforeLinkLabel={t("If you'd like to participate, just ")}
            afterLinkLabel={t(
              " and we'll send you a ticket for the next shuttle going to Ethereum World.",
            )}
            disclaimerLabel={t(
              "Please bear in mind we're onboarding new people gradually to make sure our systems can scale up. Bon voyage! 🚀",
            )}
            writeToUsLabel={t('drop us a message')}
            writeToUsUrl={'mailto:alpha@ethereum.world'}
            onWriteToUsLabelClick={handleWriteToUsLabelClick}
          />
        </Box>
      )}
      {createPostMutation && createPostMutation.state.status === 'error' && (
        <EntryPublishErrorCard message={t('Cannot publish this entry. Please try again later!')} />
      )}
      {createPostMutation && createPostMutation.state.status === 'loading' && (
        <EntryCard
          style={{ backgroundColor: '#4e71ff0f', marginBottom: '0.5rem' }}
          entryData={
            /* @Todo: Fix my type */
            createPendingEntry(loggedProfileData, createPostMutation.state.variables) as any
          }
          sharePostLabel={t('Share Post')}
          shareTextLabel={t('Share this post with your friends')}
          repliesLabel=""
          repostsLabel={t('Reposts')}
          repostLabel={t('Repost')}
          repostWithCommentLabel={t('Repost with comment')}
          shareLabel={t('Share')}
          copyLinkLabel={t('Copy Link')}
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={loggedProfileData.ethAddress}
          locale={locale || 'en'}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          contentClickable={false}
          hidePublishTime={true}
          disableActions={true}
          modalSlotId={props.layoutConfig.modalSlotId}
        />
      )}
      <FeedWidget
        modalSlotId={props.layoutConfig.modalSlotId}
        logger={logger}
        itemType={EntityTypes.ENTRY}
        pages={postPages}
        onLoadMore={handleLoadMore}
        getShareUrl={(itemId: string) =>
          `${window.location.origin}/@akashaorg/app-akasha-integration/post/${itemId}`
        }
        loginState={loginState}
        navigateTo={props.plugins['@akashaorg/app-routing']?.routing?.navigateTo}
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
        i18n={props.plugins['@akashaorg/app-translation']?.translation?.i18n}
      />
    </Box>
  );
};

export default FeedPage;
