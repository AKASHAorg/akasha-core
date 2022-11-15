import React from 'react';
import { isMobileOnly } from 'react-device-detect';

import DS from '@akashaorg/design-system';
import { IArticleData } from '@akashaorg/typings/ui';
import { IMenuItem } from '@akashaorg/design-system/lib/components/MobileListModal';

const { Avatar, Box, CardHeaderMenuDropdown, MainAreaCardBox, Icon, Image, StackedAvatar, Text } =
  DS;

export interface IArticlesMiniCardProps {
  articleData: IArticleData;
  activeTabIndex?: number;
  readTimeLabel?: string;
  copyrightLabel?: string;
  lastUpdatedLabel?: string;
  draftLabel?: string;
  menuDropOpen?: boolean;
  menuItems?: IMenuItem[];
  collaboratingLabel?: string;
  mentionsLabel?: string;
  repliesLabel?: string;
  isSaved?: boolean;
  saveLabel?: string;
  savedLabel?: string;
  onClickArticle?: (id: string) => void;
  toggleMenuDrop?: (ev: React.SyntheticEvent, id?: string) => void;
  closeMenuDrop?: () => void;
  onTagClick?: (name: string) => void;
  onMentionsClick?: (pubKey: string) => void;
  onRepliesClick?: () => void;
  onSaveClick?: () => void;
}

const ArticlesMiniCard: React.FC<IArticlesMiniCardProps> = props => {
  const {
    articleData,
    activeTabIndex,
    readTimeLabel,
    copyrightLabel,
    lastUpdatedLabel,
    draftLabel,
    menuDropOpen,
    menuItems,
    collaboratingLabel,
    mentionsLabel,
    repliesLabel,
    isSaved,
    saveLabel,
    savedLabel,
    onClickArticle,
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

  const userEthAddress = '0x003410490050000320006570034567114572000';

  const isCollaborator = articleData.collaborators?.find(el => el.ethAddress === userEthAddress);

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
          {articleData.isPublished && (
            <>
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
            </>
          )}
          {articleData.isDraft && (
            <Text
              size="medium"
              color="secondaryText"
            >{`· ${lastUpdatedLabel} ${articleData.lastUpdateDate}`}</Text>
          )}
        </Box>
        <Box direction="row" gap="small" align="center">
          {articleData.isDraft && (
            <Box
              round="1rem"
              pad={{
                horizontal: 'xsmall',
                vertical: '1px',
              }}
              background="secondaryText"
            >
              <Text color="white">{draftLabel}</Text>
            </Box>
          )}
          <Icon type="akasha" />
          <Icon
            type="moreDark"
            accentColor={menuDropOpen}
            style={{ cursor: 'pointer' }}
            ref={menuIconRef}
            onClick={ev => toggleMenuDrop(ev, articleData.id)}
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
      <Box
        direction="row"
        justify="between"
        align="center"
        onClick={() => onClickArticle(articleData.id)}
      >
        <Box gap="small">
          <Text size="xlarge" weight="bold">
            {articleData.title}
          </Text>
          <Text size="large">{articleData.subtitle}</Text>
        </Box>
        <Box>
          <Box height="5.1875rem" width="17.25rem" alignSelf="center">
            <Image fit="contain" src={articleData.image} />
          </Box>
        </Box>
      </Box>
      {articleData.isPublished && (
        <>
          <Box direction="row" wrap={true} gap="xsmall">
            {articleData.topics.map((tag, idx) => (
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
                onClick={() => onTagClick(tag)}
              >
                <Text color="accentText">{tag}</Text>
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
        </>
      )}
      {activeTabIndex === 1 && articleData.collaborators?.length > 0 && (
        <Box direction="row" gap="small" align="center">
          <StackedAvatar size="md" userData={articleData.collaborators} maxAvatars={4} />
          <Text size="medium" color="secondaryText">
            {collaboratingLabel}
          </Text>
        </Box>
      )}
      {activeTabIndex === 2 && isCollaborator && (
        <Box direction="row" gap="small" align="center">
          <Avatar size="md" ethAddress={userEthAddress} />
          <Text size="medium" color="secondaryText">
            {collaboratingLabel}
          </Text>
        </Box>
      )}
    </MainAreaCardBox>
  );
};

export default ArticlesMiniCard;
