import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@akashaorg/typings/lib/ui';
import { transformSource, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Cog8ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import MessageContactCard from '@akashaorg/design-system-components/lib/components/MessageContactCard';

export type InboxPageProps = {
  authenticatedProfile: Profile;
};

const InboxPage: React.FC<InboxPageProps> = () => {
  const { t } = useTranslation('app-messaging');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const [pinnedConvos, setPinnedConvos] = React.useState([]);

  const handleSettingsClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes.settings,
    });
  };

  // @TODO: replace with new hooks
  const followersQuery = null;
  const followers = React.useMemo(
    () => followersQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followersQuery.data?.pages],
  );

  const followingQuery = null;
  const following = React.useMemo(
    () => followingQuery.data?.pages?.reduce((acc, curr) => [...acc, ...curr.results], []),
    [followingQuery.data?.pages],
  );
  const contactList = followers?.filter(followerProfile =>
    following?.some(followingProfile => followerProfile.did.id === followingProfile.did.id),
  );
  const pinnedContacts = [];
  const unpinnedContacts = contactList?.filter(contact => {
    if (pinnedConvos?.includes(contact.did.id)) {
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

  const handlePinConversation = (id: string) => {
    let currentData: string[] = [];
    if (localStorage.getItem('Pinned Conversations')) {
      currentData = JSON.parse(localStorage.getItem('Pinned Conversations'));
    }
    const index = currentData.indexOf(id);
    if (index !== -1) {
      currentData.splice(index, 1);
    } else {
      currentData.push(id);
    }
    const uniqueData = new Set(currentData);
    const newData = Array.from(uniqueData);
    localStorage.setItem('Pinned Conversations', JSON.stringify(newData));
    setPinnedConvos(newData);
  };

  const handleCardClick = (id: string) => {
    getRoutingPlugin().navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => `${routes.chat}/${id}`,
    });
  };

  const handleAvatarClick = (id: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${id}`,
    });
  };

  return (
    <Card customStyle="max-h-[92vh]">
      <Stack spacing="gap-2" customStyle="p-4 ">
        <Stack customStyle="flex-row justify-between">
          <Text variant="h1">{t('Messaging App')}</Text>
          <button onClick={handleSettingsClick}>
            <Icon icon={<Cog8ToothIcon />} />
          </button>
        </Stack>
        <Text>{t('Write and send private, encrypted messages 🔐 to people in AKASHA World.')}</Text>
        <Stack customStyle="border(grey8 dark:grey3) rounded-lg">
          <Stack padding="px-2 py-4">
            <Text variant="h2">{t('Conversations')}</Text>
          </Stack>
          <Stack customStyle="rounded-b-lg overflow-auto">
            {!!pinnedContacts.length && (
              <Stack customStyle="shrink-0">
                <Stack padding="p-4 shrink-0">
                  <Text variant="body1">{t('PINNED')}</Text>
                </Stack>

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
                        contact.did.id,
                      )
                    }
                    senderName={contact?.name}
                    senderAvatar={contact?.avatar}
                    senderDid={contact?.did.id}
                    onClickCard={() => handleCardClick(contact.did.id)}
                    onClickAvatar={() => handleAvatarClick(contact.did.id)}
                    onConvoPin={() => handlePinConversation(contact.did.id)}
                    transformSource={transformSource}
                  />
                ))}
              </Stack>
            )}

            <Stack customStyle="shrink-0">
              {!!pinnedContacts.length && (
                <Stack customStyle="flex p-4">
                  <Text variant="body1">{t('ALL CONVERSATIONS')}</Text>
                </Stack>
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
                      contact.did.id,
                    )
                  }
                  senderName={contact?.name}
                  senderAvatar={contact?.avatar}
                  senderDid={contact?.did.id}
                  onClickCard={() => handleCardClick(contact.did.id)}
                  onClickAvatar={() => handleAvatarClick(contact.did.id)}
                  onConvoPin={() => handlePinConversation(contact.did.id)}
                  transformSource={transformSource}
                />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
};

export default InboxPage;
