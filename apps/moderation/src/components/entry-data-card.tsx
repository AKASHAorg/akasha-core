import React from 'react';
import SingleSpa from 'single-spa';
import { useTranslation } from 'react-i18next';

import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';
import { ModerationItemTypes } from '@akashaproject/ui-awf-typings';

import { redirectToPost } from '../services/routing-service';

const { Text, EntryCard, ProfileCard, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: any;
  locale: ILocale;
  itemType: string;
  singleSpa: typeof SingleSpa;
}

const EntryDataCard: React.FC<IEntryDataCardProps> = props => {
  const { entryData, itemType, locale } = props;

  const { t } = useTranslation();

  const handleNavigateToPost = redirectToPost(props.singleSpa.navigateToUrl);

  return (
    <MainAreaCardBox>
      {entryData ? (
        <>
          {/* for other contents (reply | comment, post) */}
          {itemType !== ModerationItemTypes.ACCOUNT && entryData && (
            <EntryCard
              showMore={false}
              entryData={entryData}
              repostsLabel={t('Reposts')}
              repliesLabel={t('Replies')}
              locale={locale}
              style={{ height: 'auto' }}
              contentClickable={true}
              onClickAvatar={() => null}
              onContentClick={handleNavigateToPost}
              disableReposting={true}
              isModerated={true}
              isRemoved={entryData.isRemoved}
              removedByMeLabel={t('You deleted this post')}
              removedByAuthorLabel={t(`This ${itemType} was deleted by its author`)}
            />
          )}
          {itemType === ModerationItemTypes.ACCOUNT && (
            <ProfileCard
              showMore={false}
              flaggable={true}
              canUserEdit={false}
              profileData={entryData}
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
