import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
    <Card customStyle="p-4 gap-4">
      <Box customStyle="flex-flex-row justify-between">
        <Text variant="h2">{titleLabel}</Text>
        <button onClick={onIconClick}>
          <Icon type="Cog8ToothIcon" />
        </button>
      </Box>
      <Box customStyle="flex-flex-row justify-between items-center">
        <Text variant="h6">{subtitleLabel}</Text>
        <Button size="lg" label={writeArticleLabel} onClick={onClickWriteArticle} />
      </Box>
    </Card>
  );
};

export default ArticleHeader;
