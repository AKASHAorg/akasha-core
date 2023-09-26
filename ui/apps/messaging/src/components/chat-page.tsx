import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@akashaorg/typings/lib/ui';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { markAsRead, sendMessage } from '../api/message';
import { db } from '../db/messages-db';
import { useLiveQuery } from 'dexie-react-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ChatList from '@akashaorg/design-system-components/lib/components/ChatList';
import ChatAreaHeader from '@akashaorg/design-system-components/lib/components/ChatAreaHeader';
import ChatEditor from '@akashaorg/design-system-components/lib/components/ChatEditor';
import BubbleCard from '@akashaorg/design-system-components/lib/components/BubbleCard';

export interface ChatPageProps {
  loggedProfileData: Profile;
  fetchingMessages?: boolean;
}

const ChatPage = (props: ChatPageProps) => {
  const { loggedProfileData, fetchingMessages } = props;

  const { t } = useTranslation('app-messaging');
  const { getRoutingPlugin } = useRootComponentProps();

  const navigateTo = getRoutingPlugin().navigateTo;

  const { did } = useParams<{ did: string }>();

  const onChevronLeftClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[MESSAGING],
    });
  };

  const handleProfileClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${did}`,
    });
  };

  const contactProfileId = React.useMemo(() => did, [did]);
  const loggedUserId = React.useMemo(() => loggedProfileData?.did?.id, [loggedProfileData]);

  const disablePublishing = React.useMemo(() => !loggedProfileData?.did?.id, [loggedProfileData]);

  const handleMentionClick = (profileId: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${profileId}`,
    });
  };

  const handleTagClick = (name: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-akasha-integration',
      getNavigationUrl: navRoutes => `${navRoutes.Tags}/${name}`,
    });
  };

  const handleLinkClick = (url: string) => {
    navigateTo?.({ getNavigationUrl: () => url });
  };

  const [mentionQuery, setMentionQuery] = React.useState(null);
  const [tagQuery, setTagQuery] = React.useState(null);
  const mentionQueryReq = null;
  const tagQueryReq = null;
  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };
  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  const profileDataReq = useGetProfileByDidQuery(
    { id: did },
    {
      select: data => {
        if (data.node && 'akashaProfile' in data.node) {
          return data.node;
        }
        return null;
      },
      enabled: !!did,
    },
  );

  const contactId = React.useMemo(
    () => profileDataReq?.data?.akashaProfile?.name || profileDataReq?.data?.akashaProfile?.did,
    [profileDataReq?.data],
  );

  const handleSendMessage = async publishData => {
    // publish message through textile inbox api
    const res: any = await sendMessage(contactProfileId, publishData);
    const newMessage = {
      content: res.body?.slateContent,
      did: res.body?.author,
      timestamp: res.createdAt,
      from: res.from,
      to: res.to,
      read: res.read,
      id: res.id,
      loggedUserId: loggedUserId,
      chatPartnerId: did,
    };
    // save the published messsage to the local db
    // db.messages.put(newMessage);
  };

  // real time query to get messages from local db
  const dexieMessages =
    useLiveQuery(() =>
      db.messages.where({ loggedUserId: loggedUserId, chatPartnerId: did }).sortBy('timestamp'),
    ) || [];

  // hydrate user data on messages
  const localMessages = dexieMessages.map(msg => {
    if (msg.from === loggedUserId) {
      return msg;
    } else if (msg.from === did) {
      return { ...msg, name: contactId };
    }
  });

  const indexOfLatestReadMessage = localMessages.findIndex(
    msg => !msg.read && msg.from !== loggedUserId,
  );

  const unreadMessages = localMessages.slice(indexOfLatestReadMessage);

  const markLatestMessagesRead = () => {
    if (unreadMessages?.length && did) {
      const unreadMessageIds = unreadMessages.map(message => message.id);
      // mark messages as read through textile api
      markAsRead(unreadMessageIds);
      // optimistic mark messages as read on local db
      db.messages
        .where({ from: did })
        .filter(msg => msg.read === false)
        .modify({ read: true });
      // clear new messages conversation marker
      if (localStorage.getItem('Unread Chats')) {
        const unreadChats = JSON.parse(localStorage.getItem('Unread Chats'));
        const filteredChats = unreadChats.filter(unreadChat => unreadChat !== did);
        localStorage.setItem('Unread Chats', JSON.stringify(filteredChats));
      }
    }
  };

  return (
    <Card customStyle="max-h-[92vh]">
      <Stack direction="row" align="center" customStyle="p-4">
        <button onClick={onChevronLeftClick}>
          <Icon type="ChevronLeftIcon" />
        </button>

        <Text variant="h5" customStyle="mx-auto">
          {t('Message')}
        </Text>
      </Stack>
      <Stack padding="p-2">
        <Stack fullWidth={true} justify="between" customStyle="rounded-lg border(grey8 dark:grey3)">
          <ChatAreaHeader
            name={profileDataReq.data?.akashaProfile?.name}
            avatar={profileDataReq.data?.akashaProfile?.avatar}
            did={profileDataReq.data?.akashaProfile?.did}
            onClickAvatar={handleProfileClick}
          />

          <ChatList
            emptyChatLabel={t('Start by saying hello! 👋🏼')}
            fetchingMessagesLabel={t('Fetching your messages')}
            unreadMessagesLabel={t('You have {{numberOfUnread}} new unread messages', {
              numberOfUnread: unreadMessages?.length,
            })}
            loggedUserProfileId={loggedProfileData?.did.id}
            itemCard={
              <BubbleCard
                locale="en"
                youLabel={t('You')}
                handleMentionClick={handleMentionClick}
                handleTagClick={handleTagClick}
                handleLinkClick={handleLinkClick}
              />
            }
            // oldMessages={localMessages}
            // newMessages={unreadMessages}
            fetchingMessages={fetchingMessages}
            markLatestMessagesRead={markLatestMessagesRead}
          />

          <ChatEditor
            showAvatar={false}
            profileId={loggedProfileData?.did.id}
            postLabel={t('Send')}
            placeholderLabel={t('Message')}
            emojiPlaceholderLabel={t('Search')}
            disablePublishLabel={t('Authenticating')}
            disablePublish={disablePublishing}
            onPublish={handleSendMessage}
            getMentions={handleMentionQueryChange}
            getTags={handleTagQueryChange}
            tags={tagQueryReq.data}
            mentions={mentionQueryReq.data}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ChatPage;
