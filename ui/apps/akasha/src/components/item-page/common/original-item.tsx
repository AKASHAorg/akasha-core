import * as React from 'react';
import {
  hasOwn,
  sortByKey,
  useAnalytics,
  useEntryNavigation,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import {
  EntityTypes,
  ModalNavigationOptions,
  AnalyticsCategories,
  Profile,
} from '@akashaorg/typings/lib/ui';
import { useTranslation } from 'react-i18next';
import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';
import routes, { BEAM } from '../../../routes';
import { UseQueryResult } from '@tanstack/react-query';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import EditorPlaceholder from '@akashaorg/design-system-components/lib/components/EditorPlaceholder';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';

export type OriginalItemProps = {
  itemId: string;
  itemType: EntityTypes;
  entryReq: UseQueryResult;
  loggedProfileData?: Profile;
  entryData?: AkashaBeam;
  showLoginModal: (redirectTo?: { modal: ModalNavigationOptions }) => void;
};

export const OriginalItem: React.FC<OriginalItemProps> = props => {
  const { itemId, itemType, entryReq, loggedProfileData, entryData, showLoginModal } = props;

  const { t } = useTranslation('app-akasha-integration');
  const { uiEvents, navigateToModal, getRoutingPlugin, getTranslationPlugin } =
    useRootComponentProps();

  const action = new URLSearchParams(location.search).get('action');
  const navigateTo = getRoutingPlugin().navigateTo;
  const locale = (getTranslationPlugin().i18n?.languages?.[0] || 'en') as ILocale;
  const [showAnyway, setShowAnyway] = React.useState<boolean>(false);
  const [analyticsActions] = useAnalytics();
  const handleEntryNavigate = useEntryNavigation(navigateTo, itemId);
  const profileDataReq = useGetProfileByDidQuery(
    { id: entryData.author.id },
    { select: response => response.node },
  );

  const [showReplyEditor, setShowReplyEditor] = React.useState(true);

  const isReported = React.useMemo(() => {
    if (showAnyway) {
      return false;
    }
    return entryReq.isSuccess && entryData?.nsfw;
  }, [entryData?.nsfw, showAnyway, entryReq.isSuccess]);

  const showEntry = React.useMemo(
    () => !entryData?.active && (!isReported || (isReported && entryData?.nsfw)),
    [entryData?.active, entryData?.nsfw, isReported],
  );

  const showEditButton = React.useMemo(() => entryData?.author?.isViewer, [entryData?.author]);

  const { akashaProfile: profileData } =
    profileDataReq.data && hasOwn(profileDataReq.data, 'isViewer')
      ? profileDataReq.data
      : { akashaProfile: null };

  if (!showEntry) return null;

  if (loggedProfileData?.did?.id) {
    if (action === 'edit') {
      return (
        <Extension
          name={`inline-editor_postedit_${entryData?.id}`}
          uiEvents={uiEvents}
          data={{ itemId, itemType, action: 'edit' }}
        />
      );
    }
  }

  const handleAvatarClick = (id: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${id}`,
    });
  };

  const handleRepost = (_withComment: boolean, itemId: string) => {
    analyticsActions.trackEvent({
      category: AnalyticsCategories.POST,
      action: 'Repost Clicked',
    });
    if (!loggedProfileData?.did?.id) {
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
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({ modal: { name: 'report-modal', itemId, itemType } });
    }
    navigateToModal({ name: 'report-modal', itemId, itemType });
  };

  const handleMentionClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
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

  const replyActive = !action && loggedProfileData?.did?.id;

  return (
    <Stack customStyle={`rounded-t-lg`}>
      <Stack customStyle={!replyActive && 'border(b grey8 dark:grey5)'}>
        <EntryCard
          entryData={entryData}
          sortedContents={sortByKey(entryData.content, 'order')}
          itemType={EntityTypes.BEAM}
          authorProfile={{ data: profileData, status: profileDataReq.status }}
          flagAsLabel={t('Report Post')}
          locale={locale}
          profileAnchorLink={'/profile'}
          repliesAnchorLink={routes[BEAM]}
          onAvatarClick={handleAvatarClick}
          onContentClick={() => {
            handleEntryNavigate(
              { authorId: entryData.author.id, id: entryData.id },
              EntityTypes.BEAM,
            );
          }}
          onEntryFlag={handleEntryFlag(entryData?.id, EntityTypes.BEAM)}
          contentClickable={true}
          moderatedContentLabel={t('This content has been moderated')}
          ctaLabel={t('See it anyway')}
          onEntryRemove={handlePostRemove}
          onReflect={() => setShowReplyEditor(show => !show)}
          removeEntryLabel={t('Delete Post')}
          headerMenuExt={
            showEditButton && (
              <Extension
                name={`entry-card-edit-button_${entryData?.id}`}
                style={{ width: '100%' }}
                uiEvents={uiEvents}
                data={{ itemId, itemType }}
              />
            )
          }
          actionsRightExt={
            <Extension
              name={`entry-card-actions-right_${entryData?.id}`}
              uiEvents={uiEvents}
              data={{
                itemId,
                itemType,
              }}
            />
          }
        >
          {({ blockID }) => <Extension name={`${blockID}_content_block`} uiEvents={uiEvents} />}
        </EntryCard>
      </Stack>
      <Stack customStyle="m-4">
        {!loggedProfileData?.did?.id && (
          <EditorPlaceholder
            onClick={handlePlaceholderClick}
            profileId={null}
            replyLabel={t('Reply')}
            placeholderLabel={t('Share your thoughts')}
          />
        )}
        {showReplyEditor && loggedProfileData?.did?.id && entryData?.active && (
          <Extension
            name={`inline-editor_reply_${entryData?.id}`}
            uiEvents={uiEvents}
            data={{
              itemId,
              itemType,
              action: 'reply',
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};
