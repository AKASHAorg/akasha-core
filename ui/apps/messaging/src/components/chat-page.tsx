import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile } from '@akashaorg/typings/lib/ui';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import {
  encodeSlateToBase64,
  hasOwn,
  transformSource,
  useRootComponentProps,
} from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';
import { markAsRead, sendMessage } from '../api/message';
import { db } from '../db/messages-db';
import { useLiveQuery } from 'dexie-react-hooks';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ChatList from '@akashaorg/design-system-components/lib/components/ChatList';
import ChatAreaHeader from '@akashaorg/design-system-components/lib/components/ChatAreaHeader';
import ChatEditor from '@akashaorg/design-system-components/lib/components/ChatEditor';
import BubbleCard from '@akashaorg/design-system-components/lib/components/BubbleCard';

export interface ChatPageProps {
  authenticatedProfile: Profile;
  fetchingMessages?: boolean;
}

const ChatPage = (props: ChatPageProps) => {
  const { authenticatedProfile, fetchingMessages } = props;

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
  const loggedUserId = React.useMemo(() => authenticatedProfile?.did?.id, [authenticatedProfile]);

  const disablePublishing = React.useMemo(
    () => !authenticatedProfile?.did?.id,
    [authenticatedProfile],
  );

  const handleMentionClick = (did: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${did}`,
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

  const [, setMentionQuery] = React.useState(null);
  const [, setTagQuery] = React.useState(null);
  const mentionQueryReq = null;
  const tagQueryReq = null;
  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };
  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  const { data: profileDataReq } = useGetProfileByDidQuery({ variables: { id: did }, skip: !did });

  const profileData =
    profileDataReq?.node && hasOwn(profileDataReq.node, 'akashaProfile')
      ? profileDataReq?.node?.akashaProfile
      : null;

  const contactId = React.useMemo(() => profileData?.name || profileData?.did, [profileData]);

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
          <Icon icon={<ChevronLeftIcon />} />
        </button>

        <Text variant="h5" customStyle="mx-auto">
          {t('Message')}
        </Text>
      </Stack>
      <Stack padding="p-2">
        <Stack fullWidth={true} justify="between" customStyle="rounded-lg border(grey8 dark:grey3)">
          <ChatAreaHeader
            name={profileData?.name}
            avatar={profileData?.avatar?.default}
            alternativeAvatars={profileData?.avatar?.alternatives}
            did={profileData?.did}
            onClickAvatar={handleProfileClick}
            transformSource={transformSource}
          />

          <ChatList
            emptyChatLabel={t('Start by saying hello! 👋🏼')}
            fetchingMessagesLabel={t('Fetching your messages')}
            unreadMessagesLabel={t('You have {{numberOfUnread}} new unread messages', {
              numberOfUnread: unreadMessages?.length,
            })}
            loggedUserProfileId={authenticatedProfile?.did.id}
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
            profileId={authenticatedProfile?.did.id}
            actionLabel={t('Send')}
            placeholderLabel={t('Message')}
            emojiPlaceholderLabel={t('Search')}
            disableActionLabel={t('Authenticating')}
            disablePublish={disablePublishing}
            onPublish={handleSendMessage}
            getMentions={handleMentionQueryChange}
            getTags={handleTagQueryChange}
            tags={tagQueryReq.data}
            mentions={mentionQueryReq.data}
            transformSource={transformSource}
            encodingFunction={encodeSlateToBase64}
          />
        </Stack>
      </Stack>
    </Card>
  );
};

export default ChatPage;
