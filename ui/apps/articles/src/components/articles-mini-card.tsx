import React from 'react';

import DS from '@akashaorg/design-system';
import { IArticleData } from '@akashaorg/typings/ui';

const { Avatar, Box, MainAreaCardBox, Icon, Image, Text } = DS;

export interface IArticlesMiniCardProps {
  articleData: IArticleData;
  readTimeLabel: string;
  copyrightLabel?: string;
  mentionsLabel: string;
  repliesLabel: string;
  isSaved: boolean;
  saveLabel: string;
  savedLabel: string;
  onClickArticle: () => void;
  onClickTopic: (topic: string) => () => void;
  onMentionsClick: () => void;
  onRepliesClick: () => void;
  onSaveClick: () => void;
}

const ArticlesMiniCard: React.FC<IArticlesMiniCardProps> = props => {
  const {
    articleData,
    readTimeLabel,
    copyrightLabel,
    mentionsLabel,
    repliesLabel,
    isSaved,
    saveLabel,
    savedLabel,
    onClickArticle,
    onClickTopic,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  return (
    <MainAreaCardBox pad="medium" gap="medium">
      <Box direction="row" justify="between">
        <Box direction="row" gap="xxsmall" align="center">
          <Avatar
            src={articleData.authorAvatar}
            ethAddress={articleData.authorEthAddress}
            size="xs"
            onClick={() => null}
          />
          <Text size="large">{articleData.authorName}</Text>
          <Text size="medium" color="secondaryText">
            {articleData.publishDate}
          </Text>
          <Text
            size="medium"
            color="secondaryText"
          >{`· ${articleData.readTime} ${readTimeLabel}`}</Text>
          {articleData.isCopyrighted && (
            <Text size="medium" color="secondaryText">{`· ${copyrightLabel}`}</Text>
          )}
        </Box>
        <Box direction="row" gap="small">
          <Icon type="akasha" style={{ cursor: 'pointer' }} />
          <Icon type="moreDark" style={{ cursor: 'pointer' }} />
        </Box>
      </Box>
      <Box direction="row" justify="between" align="center" onClick={onClickArticle}>
        <Box gap="small">
          <Text size="xlarge" weight="bold">
            {articleData.title}
          </Text>
          <Text size="large">{articleData.subtitle}</Text>
        </Box>
        <Box>
          <Box height="5.1875rem" width="17.25rem" alignSelf="center">
            <Image fit="contain" src={`/images/article_${articleData.placeholderImage}.png`} />
          </Box>
        </Box>
      </Box>
      <Box
        direction="row"
        wrap={true}
        gap="xsmall"
        // pad={{ horizontal: 'large', vertical: 'medium' }}
      >
        {articleData.topics.map((topic, idx) => (
          <Box
            key={idx}
            direction="row"
            round="1rem"
            gap="xxsmall"
            margin={{ bottom: 'small' }}
            pad={{
              horizontal: 'xsmall',
              vertical: '1.5px',
            }}
            background="activePanelBackground"
            border={{ color: 'accentText' }}
            style={{ cursor: 'pointer' }}
            onClick={onClickTopic(topic)}
          >
            <Text color="accentText">{topic}</Text>
          </Box>
        ))}
      </Box>
      <Box direction="row" justify="between" align="center">
        <Box direction="row" gap="xsmall" onClick={onMentionsClick}>
          <Icon type="reply" />
          <Text size="large">{articleData.mentions}</Text>
          <Text size="large">{mentionsLabel}</Text>
        </Box>
        <Box direction="row" gap="xsmall" onClick={onRepliesClick}>
          <Icon type="comments" />
          <Text size="large">{articleData.replies}</Text>
          <Text size="large">{repliesLabel}</Text>
        </Box>
        <Box direction="row" gap="xsmall" onClick={onSaveClick}>
          <Icon type="bookmark" />
          <Text size="large">{isSaved ? savedLabel : saveLabel}</Text>
        </Box>
      </Box>
    </MainAreaCardBox>
  );
};

export default ArticlesMiniCard;
