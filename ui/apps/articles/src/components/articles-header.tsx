import React from 'react';
import DS from '@akashaorg/design-system';

import { StyledButton } from './styled';

const { Box, MainAreaCardBox, Icon, Text } = DS;

export interface IArticleHeaderProps {
  titleLabel: string;
  subtitleLabel: string;
  writeArticleLabel: string;
  onIconClick: () => void;
  onClickWriteArticle: () => void;
}

const ArticleHeader: React.FC<IArticleHeaderProps> = props => {
  const { titleLabel, subtitleLabel, writeArticleLabel, onIconClick, onClickWriteArticle } = props;
  return (
    <MainAreaCardBox pad="medium" gap="medium">
      <Box direction="row" justify="between">
        <Text size="xlarge" weight="bold">
          {titleLabel}
        </Text>
        <Icon type="settingsAlt" style={{ cursor: 'pointer' }} onClick={onIconClick} />
      </Box>
      <Box direction="row" justify="between" align="center">
        <Text size="large">{subtitleLabel}</Text>
        <StyledButton
          size="large"
          height={2.5}
          label={writeArticleLabel}
          onClick={onClickWriteArticle}
        />
      </Box>
    </MainAreaCardBox>
  );
};

export default ArticleHeader;
