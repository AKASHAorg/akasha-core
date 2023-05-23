import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import DS from '@akashaorg/design-system';

import { IArticlesMiniCardProps } from '../components/articles-mini-card';
import { userData } from './dummy-data';

const { Avatar, Box, CardHeaderMenuDropdown, Icon, Image, MainAreaCardBox, StackedAvatar, Text } =
  DS;

export interface IArticleCardProps extends IArticlesMiniCardProps {
  tagsLabel: string;
  collaboratorsLabel: string;
}

const ArticleCard: React.FC<IArticleCardProps> = props => {
  const {
    articleData,
    tagsLabel,
    readTimeLabel,
    copyrightLabel,
    menuDropOpen,
    menuItems,
    collaboratorsLabel,
    mentionsLabel,
    repliesLabel,
    isSaved,
    saveLabel,
    savedLabel,
    toggleMenuDrop,
    closeMenuDrop,
    onTagClick,
    onMentionsClick,
    onRepliesClick,
    onSaveClick,
  } = props;

  const menuIconRef: React.Ref<HTMLDivElement> = React.useRef(null);

  const showCardMenu = React.useMemo(
    () => !isMobileOnly && menuItems.length > 0 && menuIconRef.current && menuDropOpen,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [menuDropOpen],
  );

  return (
    <MainAreaCardBox margin={{ bottom: 'small' }}>
      <Box pad="medium">
        <Box direction="row" justify="between">
          <Box gap="xsmall">
            <Box direction="row" gap="xxsmall" align="center">
              <Avatar
                avatar={articleData.authorAvatar}
                profileId={articleData.authorProfileId}
                size="xs"
                onClick={() => null}
              />
              <Text size="large">{articleData.authorName}</Text>
            </Box>
            <Box direction="row" gap="xxsmall">
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
          </Box>
          <Box direction="row" gap="small">
            <Icon type="akasha" />
            <Icon
              type="moreDark"
              accentColor={menuDropOpen}
              style={{ cursor: 'pointer' }}
              ref={menuIconRef}
              onClick={toggleMenuDrop}
            />
          </Box>
          {showCardMenu && (
            <CardHeaderMenuDropdown
              target={menuIconRef.current}
              onMenuClose={closeMenuDrop}
              menuItems={menuItems}
            />
          )}
        </Box>
      </Box>
      <Box
        pad={{ horizontal: 'medium', bottom: 'medium' }}
        border={{ side: 'bottom', color: 'border' }}
        gap="small"
      >
        <Text size="xlarge" weight="bold">
          {articleData.title}
        </Text>
        <Box height="12.625rem" width="100%" round="xxsmall">
          <Image fit="cover" src={articleData.image} style={{ borderRadius: 'xxsmall' }} />
        </Box>
        {articleData.content.map((el, idx) => (
          <Text key={idx} size="large" margin={{ top: 'small' }}>
            {el.value}
          </Text>
        ))}
      </Box>
      <Box pad="medium" border={{ side: 'bottom', color: 'border' }} gap="medium">
        <Box gap="small">
          <Text size="large" weight="bold" style={{ textTransform: 'uppercase' }}>
            {tagsLabel}
          </Text>
          <Box direction="row" wrap={true} gap="xsmall">
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
                onClick={topic => onTagClick(topic)}
              >
                <Text size="medium" color="accentText">
                  {topic}
                </Text>
              </Box>
            ))}
          </Box>
        </Box>
        <Box gap="small">
          <Text size="large" weight="bold" style={{ textTransform: 'uppercase' }}>
            {collaboratorsLabel}
          </Text>
          <StackedAvatar size="md" userData={userData} maxAvatars={4} />
        </Box>
      </Box>
      <Box direction="row" pad="medium" justify="between" align="center">
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
export default ArticleCard;
