import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import { useMentionSearch, useTagSearch, useGetProfile, LoginState } from '@akashaorg/ui-awf-hooks';
import { markAsRead, sendMessage } from '../api/message';
import { db } from '../db/db';
import { useLiveQuery } from 'dexie-react-hooks';

const { BasicCardBox, Box, Icon, Text, ChatList, ChatAreaHeader, ChatEditor, BubbleCard } = DS;

export interface ChatPageProps extends RootComponentProps {
  loginState: LoginState;
  fetchingMessages?: boolean;
}

const ChatPage = (props: ChatPageProps) => {
  const { loginState, fetchingMessages } = props;

  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins['@akashaorg/app-routing']?.routing?.navigateTo;

  const { pubKey } = useParams<{ pubKey: string }>();

  const onChevronLeftClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-messaging',
      getNavigationUrl: routes => routes[MESSAGING],
    });
  };

  const handleProfileClick = () => {
    navigateTo?.({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: routes => `${routes.rootRoute}/${pubKey}`,
    });
  };

  const contactPubKey = React.useMemo(() => pubKey, [pubKey]);
  const loggedUserPubKey = React.useMemo(() => loginState?.pubKey, [loginState]);

  const disablePublishing = React.useMemo(
    () => loginState?.waitForAuth || !loginState?.isReady,
    [loginState],
  );

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

  const profileDataReq = useGetProfile(contactPubKey);

  const contactId = React.useMemo(
    () =>
      profileDataReq?.data?.name ||
      profileDataReq?.data?.userName ||
      profileDataReq?.data?.ethAddress,
    [profileDataReq?.data?.ethAddress, profileDataReq?.data?.name, profileDataReq?.data?.userName],
  );

  const handleSendMessage = async publishData => {
    const res: any = await sendMessage(contactPubKey, publishData);
    const newMessage = {
      content: res.body?.slateContent,
      ethAddress: res.body?.author,
      timestamp: res.createdAt,
      from: res.from,
      to: res.to,
      read: res.read,
      id: res.id,
      loggedUserPubKey: loggedUserPubKey,
      chatPartnerPubKey: pubKey,
    };
    db.messages.put(newMessage);
  };

  const dexieMessages =
    useLiveQuery(() =>
      db.messages
        .where({ loggedUserPubKey: loggedUserPubKey, chatPartnerPubKey: pubKey })
        .sortBy('timestamp'),
    ) || [];

  const localMessages = dexieMessages.map(msg => {
    if (msg.from === loggedUserPubKey) {
      return msg;
    } else if (msg.from === pubKey) {
      return { ...msg, name: contactId };
    }
  });

  const indexOfLatestReadMessage = localMessages.findIndex(
    msg => !msg.read && msg.from !== loggedUserPubKey,
  );

  const unreadMessages = localMessages.slice(indexOfLatestReadMessage + 1);

  const markLatestMessagesRead = () => {
    if (unreadMessages?.length) {
      const newMessages = unreadMessages.map(msg => {
        return { ...msg, read: true };
      });

      db.messages.bulkPut(newMessages);

      const unreadMessageIds = unreadMessages.map(message => message.id);
      markAsRead(unreadMessageIds);
      if (localStorage.getItem('Unread Chats')) {
        const unreadChats = JSON.parse(localStorage.getItem('Unread Chats'));
        const filteredChats = unreadChats.filter(unreadChat => unreadChat !== pubKey);
        localStorage.setItem('Unread Chats', JSON.stringify(filteredChats));
      }
    }
  };

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box direction="row" pad="medium" align="center">
        <Icon type="chevronLeft" onClick={onChevronLeftClick} />
        <Text weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
          {t('Message')}
        </Text>
      </Box>
      <Box pad="small">
        <Box
          width="100%"
          background="convoAreaBackground"
          round={{ size: 'small' }}
          border={{ side: 'all', size: '1px', color: 'border' }}
          justify="between"
        >
          <ChatAreaHeader
            name={profileDataReq.data?.name}
            userName={profileDataReq.data?.userName}
            avatar={profileDataReq.data?.avatar}
            ethAddress={profileDataReq.data?.ethAddress}
            onClickAvatar={handleProfileClick}
          />

          <ChatList
            emptyChatLabel={t('Start by saying hello! 👋🏼')}
            fetchingMessagesLabel={t('Fetching your messages')}
            unreadMessagesLabel={t('You have {{numberOfUnread}} new unread messages', {
              numberOfUnread: unreadMessages?.length,
            })}
            loggedUserEthAddress={loginState?.ethAddress}
            itemCard={
              <BubbleCard
                locale="en"
                youLabel={t('You')}
                handleMentionClick={handleMentionClick}
                handleTagClick={handleTagClick}
                handleLinkClick={handleLinkClick}
              />
            }
            oldMessages={localMessages}
            newMessages={unreadMessages}
            fetchingMessages={fetchingMessages}
            markLatestMessagesRead={markLatestMessagesRead}
          />

          <ChatEditor
            showAvatar={false}
            ethAddress={loginState?.ethAddress}
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
