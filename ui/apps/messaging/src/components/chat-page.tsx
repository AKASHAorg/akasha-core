import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Profile, RootComponentProps } from '@akashaorg/typings/ui';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import { useMentionSearch, useTagSearch } from '@akashaorg/ui-awf-hooks';
import { useGetProfileByDidQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import { markAsRead, sendMessage } from '../api/message';
import { db } from '../db/messages-db';
import { useLiveQuery } from 'dexie-react-hooks';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import ChatList from '@akashaorg/design-system-components/lib/components/ChatList';
import ChatAreaHeader from '@akashaorg/design-system-components/lib/components/ChatAreaHeader';
import ChatEditor from '@akashaorg/design-system-components/lib/components/ChatEditor';
import BubbleCard from '@akashaorg/design-system-components/lib/components/BubbleCard';

export interface ChatPageProps extends RootComponentProps {
  loggedProfileData: Profile;
  fetchingMessages?: boolean;
}

const ChatPage = (props: ChatPageProps) => {
  const { loggedProfileData, fetchingMessages } = props;

  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { profileId } = useParams<{ profileId: string }>();

  const onChevronLeftClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[MESSAGING],
    });
  };

  const handleProfileClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${profileId}`,
    });
  };

  const contactProfileId = React.useMemo(() => profileId, [profileId]);
  const loggedUserId = React.useMemo(() => loggedProfileData?.did?.id, [loggedProfileData]);

  const disablePublishing = React.useMemo(() => !loggedProfileData?.did?.id, [loggedProfileData]);

  const handleMentionClick = (pubKey: string) => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: navRoutes => `${navRoutes.rootRoute}/${pubKey}`,
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
  const mentionQueryReq = useMentionSearch(mentionQuery);
  const tagQueryReq = useTagSearch(tagQuery);
  const handleMentionQueryChange = (query: string) => {
    setMentionQuery(query);
  };
  const handleTagQueryChange = (query: string) => {
    setTagQuery(query);
  };

  const profileDataReq = useGetProfileByDidQuery(
    { id: profileId },
    {
      select: data => {
        if (data.node && 'akashaProfile' in data.node) {
          return data.node;
        }
        return null;
      },
      enabled: !!profileId,
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
      chatPartnerId: profileId,
    };
    // save the published messsage to the local db
    // db.messages.put(newMessage);
  };

  // real time query to get messages from local db
  const dexieMessages =
    useLiveQuery(() =>
      db.messages
        .where({ loggedUserId: loggedUserId, chatPartnerId: profileId })
        .sortBy('timestamp'),
    ) || [];

  // hydrate user data on messages
  const localMessages = dexieMessages.map(msg => {
    if (msg.from === loggedUserId) {
      return msg;
    } else if (msg.from === profileId) {
      return { ...msg, name: contactId };
    }
  });

  const indexOfLatestReadMessage = localMessages.findIndex(
    msg => !msg.read && msg.from !== loggedUserId,
  );

  const unreadMessages = localMessages.slice(indexOfLatestReadMessage);

  const markLatestMessagesRead = () => {
    if (unreadMessages?.length && profileId) {
      const unreadMessageIds = unreadMessages.map(message => message.id);
      // mark messages as read through textile api
      markAsRead(unreadMessageIds);
      // optimistic mark messages as read on local db
      db.messages
        .where({ from: profileId })
        .filter(msg => msg.read === false)
        .modify({ read: true });
      // clear new messages conversation marker
      if (localStorage.getItem('Unread Chats')) {
        const unreadChats = JSON.parse(localStorage.getItem('Unread Chats'));
        const filteredChats = unreadChats.filter(unreadChat => unreadChat !== profileId);
        localStorage.setItem('Unread Chats', JSON.stringify(filteredChats));
      }
    }
  };

  return (
    <BasicCardBox customStyle="max-h-[92vh]">
      <Box customStyle="flx flex-row p-4 items-center">
        <button onClick={onChevronLeftClick}>
          <Icon type="ChevronLeftIcon" />
        </button>

        <Text variant="h5" customStyle="mx-auto">
          {t('Message')}
        </Text>
      </Box>
      <Box customStyle="p-2">
        <Box customStyle="flex justify-between w-full rounded-lg border(grey8 dark:grey3)">
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
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default ChatPage;
