import * as React from 'react';
import { LoginState, useAnalytics, useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import {
  EntityTypes,
  IEntryData,
  RootComponentProps,
  ModalNavigationOptions,
  AnalyticsCategories,
} from '@akashaorg/typings/ui';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import routes, { POST } from '../../../routes';
import { UseQueryResult } from 'react-query';
import { Extension } from '@akashaorg/design-system/lib/utils/extension';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import EntryBox from '@akashaorg/design-system-components/lib/components/Entry/EntryBox';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';

type Props = {
  itemId: string;
  itemType: EntityTypes;
  entryReq: UseQueryResult;
  loginState?: LoginState;
  uiEvents: RootComponentProps['uiEvents'];
  plugins: RootComponentProps['plugins'];
  layoutConfig: RootComponentProps['layoutConfig'];
  entryData?: IEntryData;
  navigateToModal: RootComponentProps['navigateToModal'];
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

export function OriginalItem({
  itemId,
  itemType,
  entryReq,
  loginState,
  uiEvents,
  plugins,
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
  const handleEntryNavigate = useEntryNavigation(navigateTo, itemId);

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
    if (action === 'edit') {
      return (
        <Extension
          name={`inline-editor_postedit_${entryData?.entryId}`}
          uiEvents={uiEvents}
          data={{ itemId, itemType, action: 'edit' }}
        />
      );
    }
  }

  const handleAvatarClick = (ev: React.MouseEvent<HTMLDivElement>, pubKey: string) => {
    ev.preventDefault();
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${pubKey}`,
    });
  };

  const handleRepost = (_withComment: boolean, itemId: string) => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Repost Clicked',
    });
    if (!loginState?.ethAddress) {
      showLoginModal();
      return;
    } else {
      navigateTo?.({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: () => `/feed?repost=${itemId}`,
      });
    }
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loginState?.pubKey) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    navigateToModal({ name: 'report-modal', itemId, itemType });
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
      itemType,
      itemId: commentId,
    });
  };

  const handlePlaceholderClick = () => {
    showLoginModal();
  };

  const replyActive = !action && loginState?.ethAddress;

  return (
    <Box customStyle={`rounded-t-lg`}>
      <Box customStyle={!replyActive && 'border(b grey8 dark:grey5)'}>
        <EntryBox
          isRemoved={entryData?.isRemoved}
          entryData={entryData}
          onClickAvatar={(ev: React.MouseEvent<HTMLDivElement>) =>
            handleAvatarClick(ev, entryData?.author?.pubKey)
          }
          flagAsLabel={t('Report Post')}
          loggedProfileEthAddress={loginState.isReady && loginState?.ethAddress}
          locale={locale}
          showMore={true}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[POST]}
          onRepost={handleRepost}
          onEntryFlag={handleEntryFlag(entryData?.entryId, EntityTypes.POST)}
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
          disableReposting={entryData?.isRemoved || itemType === EntityTypes.REPLY}
          hideRepost={itemType === EntityTypes.REPLY}
          disableReporting={loginState.waitForAuth || loginState.isSigningIn}
          headerMenuExt={
            showEditButton && (
              <Extension
                name={`entry-card-edit-button_${entryData?.entryId}`}
                style={{ width: '100%' }}
                uiEvents={uiEvents}
                data={{ itemId, itemType }}
              />
            )
          }
          actionsRightExt={
            <Extension
              name={`entry-card-actions-right_${entryData?.entryId}`}
              uiEvents={uiEvents}
              data={{
                itemId,
                itemType,
              }}
            />
          }
        />
      </Box>
      <Box customStyle="m-4">
        {!loginState?.ethAddress && (
          <EditorPlaceholder
            onClick={handlePlaceholderClick}
            ethAddress={null}
            replyLabel={t('Reply')}
            placeholderLabel={t('Share your thoughts')}
          />
        )}
        {showReplyEditor && loginState?.ethAddress && !entryData?.isRemoved && (
          <Extension
            name={`inline-editor_reply_${entryData?.entryId}`}
            uiEvents={uiEvents}
            data={{
              itemId,
              itemType,
              action: 'reply',
            }}
          />
        )}
      </Box>
    </Box>
  );
}
