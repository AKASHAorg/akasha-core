import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

import { sampleProfileData } from '../services/dummy-data';

const { Text, EntryCardMod, ProfileCardMod, MainAreaCardBox } = DS;

export interface IEntryDataCardProps {
  entryData: any;
  contentType: string;
  locale: ILocale;
}

const EntryDataCard: React.FC<IEntryDataCardProps> = props => {
  const { entryData, contentType, locale } = props;

  const { t } = useTranslation();

  return (
    <MainAreaCardBox>
      {entryData ? (
        <>
          {contentType === 'post' && entryData && (
            <EntryCardMod
              entryData={entryData}
              repostsLabel={t('Reposts')}
              repliesLabel={t('Replies')}
              locale={locale}
              style={{ height: 'auto' }}
              onClickAvatar={() => null}
              onClickReplies={() => null}
              onContentClick={() => null}
            />
          )}
          {contentType === 'profile' && (
            <ProfileCardMod
              onClickApps={() => null}
              onClickFollowing={() => null}
              profileData={sampleProfileData}
              onChangeProfileData={() => null}
              getProfileProvidersData={() => null}
              descriptionLabel={t('About me')}
              actionsLabel={t('Actions')}
              editProfileLabel={t('Edit profile')}
              changeCoverImageLabel={t('Change cover image')}
              followingLabel={t('Following')}
              appsLabel={t('Apps')}
              usersLabel={t('Users')}
              shareProfileLabel={t('Share Profile')}
              onEntryFlag={() => null}
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
