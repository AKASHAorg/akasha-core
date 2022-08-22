import React from 'react';

import DS from '@akashaorg/design-system';

import { StyledButton } from './styled';
import { articles } from './dummy-data';

const { Box, StackedAvatar, Text } = DS;

export interface IArticleEditorCardProps {
  titleValue: string;
  contentValue: string;
  collaboratingLabel: string;
  saveDraftLabel: string;
  publishLabel: string;
  canPublish: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const ArticleEditorCard: React.FC<IArticleEditorCardProps> = props => {
  const {
    titleValue,
    contentValue,
    collaboratingLabel,
    saveDraftLabel,
    publishLabel,
    canPublish,
    onSaveDraft,
    onPublish,
  } = props;

  return (
    <>
      <Box pad="medium" gap="medium" height="77vh">
        <Text size="large" weight="bold">
          {titleValue}
        </Text>
        <Text size="large">{contentValue}</Text>
      </Box>
      <Box direction="row" justify="between" pad="medium" border={{ side: 'top', color: 'border' }}>
        <Box direction="row" gap="small" align="center">
          <StackedAvatar size="md" userData={articles[1].collaborators} maxAvatars={4} />
          <Text size="large">{collaboratingLabel}</Text>
        </Box>
        <Box direction="row" fill="horizontal" justify="end" align="center" gap="small">
          <StyledButton size="large" height={2.5} label={saveDraftLabel} onClick={onSaveDraft} />
          <StyledButton
            size="large"
            height={2.5}
            disabled={!canPublish}
            primary={true}
            label={publishLabel}
            onClick={onPublish}
          />
        </Box>
      </Box>
    </>
  );
};

export default ArticleEditorCard;
