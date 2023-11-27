import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Cog8ToothIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack direction="row" justify="between">
        <Text variant="h2">{titleLabel}</Text>
        <button onClick={onIconClick}>
          <Icon icon={<Cog8ToothIcon />} />
        </button>
      </Stack>
      <Stack direction="row" justify="between" align="center">
        <Text variant="h6">{subtitleLabel}</Text>
        <Button size="lg" label={writeArticleLabel} onClick={onClickWriteArticle} />
      </Stack>
    </Card>
  );
};

export default ArticleHeader;
