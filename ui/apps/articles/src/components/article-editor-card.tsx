import React from 'react';
import { withHistory } from 'slate-history';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import DS from '@akashaorg/design-system';

import { StyledButton } from './styled';
import { articles } from './dummy-data';

const { Box, StackedAvatar, Text } = DS;

export interface IArticleEditorCardProps {
  collaboratingLabel: string;
  saveDraftLabel: string;
  publishLabel: string;
  canPublish: boolean;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const ArticleEditorCard: React.FC<IArticleEditorCardProps> = props => {
  const { collaboratingLabel, saveDraftLabel, publishLabel, canPublish, onSaveDraft, onPublish } =
    props;

  const titleEditor = React.useMemo(() => withHistory(withReact(createEditor())), []);
  const contentEditor = React.useMemo(() => withHistory(withReact(createEditor())), []);

  const initialValue: Descendant[] = [
    {
      type: 'paragraph',
      children: [{ text: '' }],
    },
  ];

  return (
    <>
      <Box
        gap="medium"
        pad={{ horizontal: 'medium' }}
        margin={{ vertical: 'medium' }}
        style={{ maxHeight: '73vh', overflowY: 'scroll' }}
      >
        {/* slate editors for the article title and content */}
        <Slate editor={titleEditor} value={initialValue} onChange={() => null}>
          <Editable placeholder="Your Title" />
        </Slate>
        <Slate editor={contentEditor} value={initialValue} onChange={() => null}>
          <Editable placeholder="Start sharing knowledge" />
        </Slate>
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
