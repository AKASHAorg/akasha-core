import React from 'react';
import sortBy from 'lodash/sortBy';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import AuthorProfileAvatar from '@akashaorg/ui-lib-feed/lib/components/cards/author-profile-avatar';
import { useTranslation } from 'react-i18next';
import {
  EntityTypes,
  NavigateToParams,
  Profile,
  IContentClickDetails,
} from '@akashaorg/typings/lib/ui';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { mapBeamEntryData, useAkashaStore, useRootComponentProps } from '@akashaorg/ui-awf-hooks';

export type EntryCardRendererProps = {
  itemData?: AkashaBeam;
  itemType?: EntityTypes;
  authenticatedProfile?: Profile;
  navigateTo?: (args: NavigateToParams) => void;
  onContentClick: (details: IContentClickDetails, itemType: EntityTypes) => void;
  onAvatarClick: (ev: React.MouseEvent<HTMLDivElement>, authorEth: string) => void;
  onMentionClick: (profileId: string) => void;
  onTagClick: (name: string) => void;
  style?: React.CSSProperties;
  contentClickable?: boolean;
  moderatedContentLabel?: string;
  ctaLabel?: string;
  handleFlipCard?: (entry: AkashaBeam, isQuote: boolean) => () => void;
};

const EntryCardRenderer = (props: EntryCardRendererProps) => {
  const { itemData, itemType, contentClickable, navigateTo, onContentClick } = props;
  const { id } = itemData || {};
  const { t } = useTranslation('app-search');
  const { navigateToModal } = useRootComponentProps();
  const {
    data: { authenticatedDID },
  } = useAkashaStore();
  const isLoggedIn = !!authenticatedDID;

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

  const handleFlag = () => {
    navigateTo({
      appName: '@akashaorg/app-vibes',
      getNavigationUrl: () => `/report/${itemType}/${itemData.id}`,
    });
  };

  const handleEntryRemove = (itemId: string) => {
    if (itemId)
      navigateToModal({
        name: 'entry-remove-confirmation',
        itemType: EntityTypes.BEAM,
        itemId,
      });
  };

  const hideActionButtons = React.useMemo(() => itemType === EntityTypes.REFLECT, [itemType]);

  return (
    <>
      {itemData && itemData.author?.id && (
        <Stack customStyle="mb-2">
          {!itemData.nsfw && itemData.active && (
            <EntryCard
              entryData={mapBeamEntryData(itemData)}
              sortedContents={sortBy(itemData.content, 'order')}
              itemType={EntityTypes.BEAM}
              onContentClick={handleContentClick}
              flagAsLabel={t('Flag')}
              moderatedContentLabel={t('This content has been moderated')}
              reflectAnchorLink={`/@akashaorg/app-antenna/${
                itemType === EntityTypes.REFLECT ? 'reflection' : 'beam'
              }`}
              contentClickable={contentClickable}
              isViewer={authenticatedDID === itemData.author.id}
              isLoggedIn={isLoggedIn}
              removeEntryLabel={t('Delete Post')}
              onEntryRemove={handleEntryRemove}
              onEntryFlag={handleFlag}
              hideActionButtons={hideActionButtons}
              profileAvatarExt={
                <AuthorProfileAvatar
                  authorId={itemData.author.id}
                  createdAt={itemData?.createdAt}
                />
              }
              actionsRight={<Extension name={`entry-card-actions-right_${id}`} />}
            >
              {({ blockID }) => <Extension name={`${blockID}_content_block`} />}
            </EntryCard>
          )}
        </Stack>
      )}
    </>
  );
};

export default EntryCardRenderer;
