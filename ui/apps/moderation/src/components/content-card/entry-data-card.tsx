import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import {
  NavigateToParams,
  IEntryData,
  EntityTypes,
  ModerationEntityTypesMap,
  IContentClickDetails,
} from '@akashaorg/typings/ui';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';
import EntryCard from '@akashaorg/design-system-components/lib/components/Entry/EntryCard';

const { Text, ProfileCard, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: IEntryData | Profile;
  locale: ILocale;
  itemType: EntityTypes;
  modalSlotId: string;
  navigateTo?: (args: NavigateToParams) => void;
}

const EntryDataCard: React.FC<IEntryDataCardProps> = props => {
  const { entryData, itemType, locale, modalSlotId } = props;

  const { t } = useTranslation('app-moderation-ewa');

  const handleEntryNavigate = useEntryNavigation(props.navigateTo);

  const handleContentClick = React.useCallback(
    (details: IContentClickDetails) => {
      if (itemType) {
        handleEntryNavigate(details, itemType);
      }
    },
    [handleEntryNavigate, itemType],
  );

  const itemTypeName = ModerationEntityTypesMap[itemType];

  return (
    <MainAreaCardBox>
      {entryData ? (
        <>
          {/* for other contents (reply | comment, post) */}
          {itemType !== EntityTypes.PROFILE && entryData && (
            <EntryCard
              showMore={false}
              entryData={entryData as IEntryData}
              locale={locale}
              style={{ height: 'auto' }}
              contentClickable={true}
              onClickAvatar={() => null}
              onContentClick={handleContentClick}
              disableReposting={true}
              isModerated={true}
              isRemoved={(entryData as IEntryData).isRemoved}
              removedByMeLabel={t('You deleted this post')}
              removedByAuthorLabel={t('This {{itemTypeName}} was deleted by its author', {
                itemTypeName,
              })}
            />
          )}
          {itemType === EntityTypes.PROFILE && (
            <ProfileCard
              modalSlotId={modalSlotId}
              showMore={false}
              flaggable={true}
              profileData={entryData as Profile}
              followLabel={t('Follow')}
              unfollowLabel={t('Unfollow')}
              followingLabel={t('Following')}
              shareProfileLabel={t('Share Profile')}
              onEntryFlag={() => null}
              onUpdateClick={() => null}
              hideENSButton={true}
              handleShareClick={() => null}
            />
          )}
        </>
      ) : (
        <Text textAlign="center">Loading content...</Text>
      )}
    </MainAreaCardBox>
  );
};

export default EntryDataCard;
