import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
import { useFollowers, useFollowing } from '@akashaorg/ui-awf-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import MessageContactCard from '@akashaorg/design-system-components/lib/components/MessageContactCard';

export interface InboxPageProps extends RootComponentProps {
  loggedProfileData: Profile;
}

const InboxPage: React.FC<InboxPageProps> = props => {
  const { loggedProfileData, plugins } = props;

  const { t } = useTranslation('app-messaging');

  const navigateTo = plugins['@akashaorg/app-routing']?.routing?.navigateTo;

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
    plugins['@akashaorg/app-routing']?.routing?.navigateTo?.({
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
    <Card customStyle="max-h-[92vh]">
      <Box customStyle="flex p-4 gap-2">
        <Box customStyle="flex flex-row justify-between">
          <Text variant="h1">{t('Messaging App')}</Text>
          <button onClick={handleSettingsClick}>
            <Icon type="Cog8ToothIcon" />
          </button>
        </Box>
        <Text>{t('Write and send private, encrypted messages 🔐 to people in Akasha World.')}</Text>
        <Box customStyle="flex border(grey8 dark:grey3) rounded-lg">
          <Box customStyle="flex px-2 py-4">
            <Text variant="h2">{t('Conversations')}</Text>
          </Box>
          <Box customStyle="rounded-b-lg overflow-auto">
            {!!pinnedContacts.length && (
              <Box customStyle="flex shrink-0">
                <Box customStyle="p-4 flex shrink-0">
                  <Text variant="body1">{t('PINNED')}</Text>
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

            <Box customStyle="flex shrink-0">
              {!!pinnedContacts.length && (
                <Box customStyle="flex p-4">
                  <Text variant="body1">{t('ALL CONVERSATIONS')}</Text>
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
    </Card>
  );
};

export default InboxPage;
