import * as React from 'react';
import DS from '@akashaorg/design-system';
import { useTranslation } from 'react-i18next';
import { RootComponentProps } from '@akashaorg/ui-awf-typings';
import { MESSAGING } from '../routes';
import { useParams } from 'react-router';
import {
  useGetLogin,
  useMentionSearch,
  useTagSearch,
  useGetProfile,
  uploadMediaToTextile,
} from '@akashaorg/ui-awf-hooks';

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

  const handleSendMessage = (_data: any) => {
    return;
  };

  return (
    <BasicCardBox style={{ maxHeight: '92vh' }}>
      <Box
        direction="row"
        pad="medium"
        align="center"
        border={{ side: 'bottom', color: 'lightBorder' }}
      >
        <Icon type="chevronLeft" onClick={onChevronLeftClick} />
        <Text weight="bold" size="large" margin={{ vertical: '0', horizontal: 'auto' }}>
          {t('Message')}
        </Text>
      </Box>
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
                youLabel="You"
                handleMentionClick={handleMentionClick}
                handleTagClick={handleTagClick}
                handleLinkClick={handleLinkClick}
              />
            }
            chatArr={[]}
          />
        }
        editorElement={
          <ChatEditor
            showAvatar={false}
            ethAddress={loginState?.ethAddress}
            postLabel={t('Send')}
            placeholderLabel={`t('Message')`}
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
    </BasicCardBox>
  );
};

export default ChatPage;
