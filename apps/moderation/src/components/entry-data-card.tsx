import React from 'react';
import { useTranslation } from 'react-i18next';
import DS from '@akashaproject/design-system';
import { ILocale } from '@akashaproject/design-system/lib/utils/time';

const { Text, EntryCardMod, ProfileCard, MainAreaCardBox } = DS;

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
            <ProfileCard
              flaggable={true}
              canUserEdit={false}
              profileData={entryData}
              appsLabel={t('Apps')}
              usersLabel={t('Users')}
              actionsLabel={''}
              followingLabel={t('Following')}
              descriptionLabel={t('About me')}
              shareProfileLabel={t('Share Profile')}
              flagAsLabel={t('Report Profile')}
              onClickApps={() => {}}
              onClickFollowing={() => {}}
              onEntryFlag={() => null}
              onUpdateClick={() => null}
              onENSChangeClick={() => null}
              hideENSButton={true}
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
