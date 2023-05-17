import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
import { useFollowers, useFollowing } from '@akashaorg/ui-awf-hooks';

const { BasicCardBox, Box, Icon, Text, MessageContactCard } = DS;

export interface InboxPageProps extends RootComponentProps {
  loggedProfileData: Profile;
}

const InboxPage: React.FC<InboxPageProps> = props => {
  const { loggedProfileData } = props;

  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const [pinnedConvos, setPinnedConvos] = React.useState([]);

  const loggedUserId = React.useMemo(() => loggedProfileData?.did?.id, [loggedProfileData]);

  const handleSettingsClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes.settings,
    });
  };

  // @TODO: replace with new hooks
  const followersQuery = useFollowers(loggedUserId, 500);
  const followers = React.useMemo(
    () => followersQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followersQuery.data?.pages],
  );

  const followingQuery = useFollowing(loggedUserId, 500);
  const following = React.useMemo(
    () => followingQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followingQuery.data?.pages],
  );
  const contactList = followers?.filter(followerProfile =>
    following?.some(followingProfile => followerProfile.pubKey === followingProfile.pubKey),
  );
  const pinnedContacts = [];
  const unpinnedContacts = contactList?.filter(contact => {
    if (pinnedConvos?.includes(contact.pubKey)) {
      pinnedContacts.push(contact);
      return false;
    } else {
      return true;
    }
  });

  React.useEffect(() => {
    if (localStorage.getItem('Pinned Conversations')) {
      const currentData = JSON.parse(localStorage.getItem('Pinned Conversations'));
      setPinnedConvos(currentData);
    }
  }, []);

  const handlePinConversation = (pubKey: string) => {
    let currentData: string[] = [];
    if (localStorage.getItem('Pinned Conversations')) {
      currentData = JSON.parse(localStorage.getItem('Pinned Conversations'));
    }
    const index = currentData.indexOf(pubKey);
    if (index !== -1) {
      currentData.splice(index, 1);
    } else {
      currentData.push(pubKey);
    }
    const uniqueData = new Set(currentData);
    const newData = Array.from(uniqueData);
    localStorage.setItem('Pinned Conversations', JSON.stringify(newData));
    setPinnedConvos(newData);
  };

  const handleCardClick = (pubKey: string) => {
    props.plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${pubKey}`,
    });
  };

  const handleAvatarClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
    });
  };

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box pad="medium" gap="small">
        <Box direction="row" justify="between">
          <Text size="large" weight={'bold'}>
            {t('Messaging App')}
          </Text>
          <Icon type="settingsAlt" onClick={handleSettingsClick} clickable={true} />
        </Box>
        <Text>
          {t('Write and send private, encrypted messages 🔐 to people in Ethereum World.')}
        </Text>
        <Box border={{ color: 'border', side: 'all' }} round="small">
          <Box pad={{ horizontal: 'small', vertical: 'medium' }}>
            <Text weight={'bold'} size="large">
              {t('Conversations')}
            </Text>
          </Box>
          <Box overflow={'auto'} round={{ corner: 'bottom', size: 'small' }}>
            {!!pinnedContacts.length && (
              <Box flex={{ shrink: 0 }}>
                <Box pad="medium" flex={{ shrink: 0 }}>
                  <Text weight={'bold'}>{t('PINNED')}</Text>
                </Box>

                {pinnedContacts.map((contact, idx) => (
                  <MessageContactCard
                    key={idx}
                    locale="en"
                    pinConvoLabel={t('Pin Conversation')}
                    unpinConvoLabel={t('Unpin Conversation')}
                    newMessageLabel={t('New')}
                    isPinned={true}
                    isRead={
                      !JSON.parse(localStorage.getItem(`Unread Chats`) || '[]').includes(
                        contact.pubKey,
                      )
                    }
                    senderName={contact?.name}
                    senderAvatar={contact?.avatar}
                    senderProfileId={contact?.did.id}
                    onClickCard={() => handleCardClick(contact.pubKey)}
                    onClickAvatar={() => handleAvatarClick(contact.pubKey)}
                    onConvoPin={() => handlePinConversation(contact.pubKey)}
                  />
                ))}
              </Box>
            )}

            <Box flex={{ shrink: 0 }}>
              {!!pinnedContacts.length && (
                <Box pad="medium">
                  <Text weight={'bold'}>{t('ALL CONVERSATIONS')}</Text>
                </Box>
              )}

              {unpinnedContacts?.map((contact, idx) => (
                <MessageContactCard
                  key={idx}
                  locale="en"
                  pinConvoLabel={t('Pin Conversation')}
                  unpinConvoLabel={t('Unpin Conversation')}
                  newMessageLabel={t('New')}
                  hideBottomBorder={idx === unpinnedContacts.length - 1}
                  isPinned={false}
                  isRead={
                    !JSON.parse(localStorage.getItem(`Unread Chats`) || '[]').includes(
                      contact.pubKey,
                    )
                  }
                  senderName={contact?.name}
                  senderAvatar={contact?.avatar}
                  senderProfileId={contact?.did.id}
                  onClickCard={() => handleCardClick(contact.pubKey)}
                  onClickAvatar={() => handleAvatarClick(contact.pubKey)}
                  onConvoPin={() => handlePinConversation(contact.pubKey)}
                />
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default InboxPage;
