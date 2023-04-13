import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { ILocale } from '@akashaorg/design-system/src/utils/time';
import {
  NavigateToParams,
  IEntryData,
  IProfileData,
  EntityTypes,
  ModerationEntityTypesMap,
} from '@akashaorg/typings/ui';
import { useEntryNavigation } from '@akashaorg/ui-awf-hooks';
import { IContentClickDetails } from '@akashaorg/design-system/lib/components/EntryCard/entry-box';

const { Text, EntryCard, ProfileCard, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: IEntryData | IProfileData;
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
              modalSlotId={modalSlotId}
              showMore={false}
              entryData={entryData as IEntryData}
              repliesLabel={t('Replies')}
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
              viewerIsOwner={false}
              profileData={entryData as IProfileData}
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
