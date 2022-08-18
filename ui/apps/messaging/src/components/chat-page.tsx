import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/typings/ui';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import {
  useGetLogin,
  useMentionSearch,
  useTagSearch,
  useGetProfile,
  uploadMediaToTextile,
} from '@akashaorg/ui-awf-hooks';
import { getMessages, markAsRead, sendMessage } from '../api/message';

const {
  BasicCardBox,
  Box,
  Icon,
  Text,
  ChatArea,
  ChatList,
  ChatAreaHeader,
  ChatEditor,
  BubbleCard,
} = DS;

const ChatPage = (props: RootComponentProps) => {
  const { t } = useTranslation('app-messaging');

  const navigateTo = props.plugins.routing?.navigateTo;

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

  const loginQuery = useGetLogin();
  const loginState = loginQuery.data;

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

  const profileDataReq = useGetProfile(pubKey);

  const sender = React.useMemo(
    () =>
      profileDataReq?.data?.name ||
      profileDataReq?.data?.userName ||
      profileDataReq?.data?.ethAddress,
    [profileDataReq?.data?.ethAddress, profileDataReq?.data?.name, profileDataReq?.data?.userName],
  );

  const handleSendMessage = async publishData => {
    const res: any = await sendMessage(pubKey, publishData);
    const newMessage = {
      content: res.body?.slateContent,
      ethAddress: res.body?.author,
      timestamp: res.createdAt,
      from: res.from,
      to: res.to,
      read: res.read,
      id: res.id,
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const [messages, setMessages] = React.useState([]);
  React.useEffect(() => {
    getMessages()
      .then(result => {
        const conversation = result
          ?.map(res => {
            if (res.body.content && (res.from === pubKey || res.from === loginState.pubKey)) {
              return {
                content: res.body.content?.slateContent,
                ethAddress: res.body.content?.author,
                timestamp: res.createdAt,
                name: sender,
                from: res.from,
                to: res.to,
                read: res.read,
                id: res.id,
              };
            }
            return null;
          })
          .filter(Boolean);
        setMessages(conversation);
      })
      .catch(err => console.log(err));
  }, [pubKey, loginState.pubKey, sender]);

  React.useEffect(() => {
    if (messages.length) {
      const unreadMessages = messages.filter(message => message.from === pubKey && !message.read);
      const unreadMessageIds = unreadMessages.map(message => message.id);
      markAsRead(unreadMessageIds);
    }
  }, [messages, pubKey]);

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box direction="row" pad="medium" align="center">
        <Icon type="chevronLeft" onClick={onChevronLeftClick} />
        <Text weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
          {t('Message')}
        </Text>
      </Box>
      <Box pad="small">
        <ChatArea
          headerElement={
            <ChatAreaHeader
              name={profileDataReq.data?.name}
              userName={profileDataReq.data?.userName}
              avatar={profileDataReq.data?.avatar}
              ethAddress={profileDataReq.data?.ethAddress}
              onClickAvatar={handleProfileClick}
            />
          }
          bodyElement={
            <ChatList
              emptyChatLabel={t('Start by saying hello! 👋🏼')}
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
              chatArr={messages || []}
            />
          }
          editorElement={
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
              uploadRequest={uploadMediaToTextile}
            />
          }
        />
      </Box>
    </BasicCardBox>
  );
};

export default ChatPage;
