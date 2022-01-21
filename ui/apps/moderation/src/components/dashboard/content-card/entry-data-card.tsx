import React from 'react';
import SingleSpa from 'single-spa';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { ModerationItemTypes } from '@akashaproject/ui-awf-typings';
import { useHandleNavigation } from '@akashaproject/ui-awf-hooks';
import { IContentClickDetails } from '@akashaproject/design-system/lib/components/EntryCard/entry-box';
import { ITEM_TYPE_CONVERTER } from '../../../services/constants';
import { IEntryData } from '@akashaproject/ui-awf-typings/lib/entry';
import { IProfileData } from '@akashaproject/ui-awf-typings/lib/profile';

const { Text, EntryCard, ProfileCard, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: IEntryData | IProfileData;
  locale: ILocale;
  itemType: string;
  singleSpa: typeof SingleSpa;
  modalSlotId: string;
}

const EntryDataCard: React.FC<IEntryDataCardProps> = props => {
  const { entryData, itemType, locale, modalSlotId } = props;

  const { t } = useTranslation();

  const handleNavigate = useHandleNavigation(props.singleSpa.navigateToUrl);

  const handleContentClick = React.useCallback(
    (details: IContentClickDetails) => {
      const translatedItemType = ITEM_TYPE_CONVERTER[itemType];
      if (translatedItemType >= 0) {
        handleNavigate(details, translatedItemType);
      }
    },
    [handleNavigate, itemType],
  );

  return (
    <MainAreaCardBox>
      {entryData ? (
        <>
          {/* for other contents (reply | comment, post) */}
          {itemType !== ModerationItemTypes.ACCOUNT && entryData && (
            <EntryCard
              modalSlotId={modalSlotId}
              showMore={false}
              entryData={entryData as IEntryData}
              repostsLabel={t('Reposts')}
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
              removedByAuthorLabel={t(`This ${itemType} was deleted by its author`)}
            />
          )}
          {itemType === ModerationItemTypes.ACCOUNT && (
            <ProfileCard
              modalSlotId={modalSlotId}
              showMore={false}
              flaggable={true}
              canUserEdit={false}
              profileData={entryData as IProfileData}
              postsLabel={t('Posts')}
              followLabel={t('Follow')}
              unfollowLabel={t('Unfollow')}
              followersLabel={t('Followers')}
              followingLabel={t('Following')}
              interestsLabel={t('Interests')}
              descriptionLabel={t('About me')}
              shareProfileLabel={t('Share Profile')}
              onClickFollowers={() => null}
              onClickPosts={() => null}
              onClickFollowing={() => null}
              onEntryFlag={() => null}
              onUpdateClick={() => null}
              onENSChangeClick={() => null}
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
