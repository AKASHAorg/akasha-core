import React from 'react';
import sortBy from 'lodash/sortBy';
import { useTranslation } from 'react-i18next';
import {
  EntityTypes,
  NavigateToParams,
  Profile,
  IContentClickDetails,
} from '@akashaorg/typings/lib/ui';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';
import { Extension } from '@akashaorg/ui-lib-extensions/lib/react/extension';
import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import {
  hasOwn,
  mapBeamEntryData,
  transformSource,
  useGetLogin,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

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
  const { getTranslationPlugin, navigateToModal } = useRootComponentProps();
  const { data } = useGetLogin();
  const authenticatedDID = data?.id;
  const isLoggedIn = !!data?.id;
  const {
    data: profileDataReq,
    loading,
    error,
  } = useGetProfileByDidQuery({
    variables: { id: itemData.author.id },
  });

  const { akashaProfile: profileData } =
    profileDataReq?.node && hasOwn(profileDataReq.node, 'akashaProfile')
      ? profileDataReq.node
      : { akashaProfile: null };

  const locale = getTranslationPlugin().i18n?.languages?.[0] || 'en';

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
        <div style={{ marginBottom: '8px' }}>
          {!itemData.nsfw && itemData.active && (
            <EntryCard
              entryData={mapBeamEntryData(itemData)}
              authorProfile={{ data: profileData, loading, error }}
              sortedContents={sortBy(itemData.content, 'order')}
              itemType={EntityTypes.BEAM}
              onAvatarClick={handleClickAvatar}
              onContentClick={handleContentClick}
              flagAsLabel={t('Flag')}
              locale={locale}
              moderatedContentLabel={t('This content has been moderated')}
              profileAnchorLink={'/@akashaorg/app-profile'}
              reflectAnchorLink={`/@akashaorg/app-akasha-integration/${
                itemType === EntityTypes.REFLECT ? 'reflection' : 'beam'
              }`}
              contentClickable={contentClickable}
              isViewer={authenticatedDID === itemData.author.id}
              isLoggedIn={isLoggedIn}
              removeEntryLabel={t('Delete Post')}
              onEntryRemove={handleEntryRemove}
              onEntryFlag={handleFlag}
              hideActionButtons={hideActionButtons}
              actionsRight={<Extension name={`entry-card-actions-right_${id}`} />}
              transformSource={transformSource}
            >
              {({ blockID }) => <Extension name={`${blockID}_content_block`} />}
            </EntryCard>
          )}
        </div>
      )}
    </>
  );
};

export default EntryCardRenderer;
