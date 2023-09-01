import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  EntityTypes,
  ModalNavigationOptions,
  NavigateToParams,
  Profile,
  IContentClickDetails,
} from '@akashaorg/typings/ui';
import { ILocale } from '@akashaorg/design-system-core/lib/utils/time';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Extension from '@akashaorg/design-system-components/lib/components/Extension';
import { AkashaBeam } from '@akashaorg/typings/sdk/graphql-types-new';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export interface IEntryCardRendererProps {
  itemData?: AkashaBeam;
  itemType?: EntityTypes;
  locale?: ILocale;
  loggedProfileData?: Profile;
  navigateTo?: (args: NavigateToParams) => void;
  onContentClick: (details: IContentClickDetails, itemType: EntityTypes) => void;
  onRebeam: (withComment: boolean, entryId: string) => void;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (profileId: string) => void;
  onTagClick: (name: string) => void;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: AkashaBeam, isQuote: boolean) => () => void;
}

const EntryCardRenderer = (props: IEntryCardRendererProps) => {
  const {
    loggedProfileData,
    locale,
    itemData,
    itemType,
    style,
    contentClickable,
    onRebeam,
    navigateTo,
    onMentionClick,
    onTagClick,
    onContentClick,
  } = props;

  const { id } = itemData || {};

  const { t } = useTranslation('app-search');
  const { uiEvents, navigateToModal } = useRootComponentProps();

  const handleClickAvatar = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${itemData?.author.id}`,
    });
  };

  const handleContentClick = () => {
    onContentClick(
      {
        id: itemData.id,
        authorId: itemData.author.id,
        replyTo: itemData.id ? { itemId: itemData.id } : null,
      },
      itemType,
    );
  };

  // @TODO replace with new moderation hooks
  // const [isReported, isAccountReported] = React.useMemo(() => {
  //   if (showAnyway) {
  //     return [false, false];
  //   }
  //   return [itemData?.reported, itemData?.author?.reported];
  // }, [itemData, showAnyway]);

  // const accountAwaitingModeration = !itemData?.author?.moderated && isAccountReported;
  // const entryAwaitingModeration = !itemData?.moderated && isReported;

  // const itemTypeName = React.useMemo(() => {
  //   switch (itemType) {
  //     case EntityTypes.POST:
  //       return t('post');
  //     case EntityTypes.PROFILE:
  //       return t('account');
  //     case EntityTypes.REPLY:
  //       return t('reply');
  //     case EntityTypes.TAG:
  //       return t('tag');
  //     default:
  //       return t('unknown');
  //   }
  // }, [t, itemType]);

  const handleEntryRemove = (itemId: string) => {
    if (itemId)
      navigateToModal({
        name: 'entry-remove-confirmation',
        itemType: EntityTypes.BEAM,
        itemId,
      });
  };

  const showLoginModal = (redirectTo?: { modal: ModalNavigationOptions }) => {
    navigateToModal({ name: 'login', redirectTo });
  };

  const handleEntryFlag = (itemId: string, itemType: EntityTypes) => () => {
    if (!loggedProfileData?.did?.id) {
      return showLoginModal({
        modal: { name: 'report-modal', itemId, itemType: itemType as unknown as EntityTypes },
      });
    }

    if (itemId)
      navigateToModal({
        name: 'report-modal',
        itemId,
        itemType: itemType as unknown as EntityTypes,
      });
  };

  const handleRebeam = () => {
    if (onRebeam) {
      onRebeam(false, id);
    }
  };

  const hideActionButtons = React.useMemo(() => itemType === EntityTypes.REFLECT, [itemType]);

  return (
    <>
      {itemData && itemData.author?.id && (
        <div style={{ marginBottom: '8px' }}>
          {/* {(accountAwaitingModeration || entryAwaitingModeration) && (
            <EntryCardHidden
              reason={entryAwaitingModeration ? itemData.reason : itemData.author?.reason}
              headerTextLabel={t(
                'You reported {{ isAuthorString }} {{ itemTypeName }} for the following reason',
                {
                  itemTypeName,
                  isAuthorString: accountAwaitingModeration ? 'the author of this' : 'this',
                },
              )}
              footerTextLabel={t('It is awaiting moderation.')}
              ctaLabel={t('See it anyway')}
              handleFlipCard={handleFlipCard}
            />
          )} */}

          {/* {!entryAwaitingModeration &&
            !accountAwaitingModeration && */}
          {!itemData.nsfw && itemData.active && (
            <EntryCard
              isRemoved={!itemData.active}
              entryData={itemData}
              onClickAvatar={handleClickAvatar}
              flagAsLabel={t('Report Post')}
              locale={locale || 'en'}
              style={{ height: 'auto', ...style }}
              moderatedContentLabel={t('This content has been moderated')}
              showMore={true}
              profileAnchorLink={'/@akashaorg/app-profile'}
              repliesAnchorLink={`/@akashaorg/app-akasha-integration/${
                itemType === EntityTypes.REFLECT ? 'reply' : 'post'
              }`}
              onRepost={handleRebeam}
              onContentClick={handleContentClick}
              onMentionClick={onMentionClick}
              onTagClick={onTagClick}
              navigateTo={navigateTo}
              contentClickable={contentClickable}
              disableReposting={!itemData.active}
              removeEntryLabel={t('Delete Post')}
              onEntryRemove={handleEntryRemove}
              onEntryFlag={handleEntryFlag(itemData.id, EntityTypes.BEAM)}
              hideActionButtons={hideActionButtons}
              actionsRightExt={
                <Extension name={`entry-card-actions-right_${id}`} uiEvents={uiEvents} />
              }
              headerMenuExt={
                itemData.author.isViewer && (
                  <Extension name={`entry-card-edit-button_${id}`} uiEvents={uiEvents} />
                )
              }
            />
          )}
        </div>
      )}
    </>
  );
};

export default EntryCardRenderer;
