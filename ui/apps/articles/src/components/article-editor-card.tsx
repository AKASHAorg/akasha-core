import React from 'react';
import { withHistory } from 'slate-history';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import DS from '@akashaorg/design-system';

import { articles } from './dummy-data';

const { Box, Button, StackedAvatar, Text } = DS;

export interface IArticleEditorCardProps {
  inviteCollaboratorsLabel: string;
  collaboratingLabel: string;
  saveDraftLabel: string;
  publishLabel: string;
  canPublish: boolean;
  onManageCollaborators: () => void;
  onSaveDraft: () => void;
  onPublish: () => void;
}

const ArticleEditorCard: React.FC<IArticleEditorCardProps> = props => {
  const {
    inviteCollaboratorsLabel,
    collaboratingLabel,
    saveDraftLabel,
    publishLabel,
    canPublish,
    onManageCollaborators,
    onSaveDraft,
    onPublish,
  } = props;

  // get collaborators
  const articleCollaborators = articles[1].collaborators;
  // const articleCollaborators = [];

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
        <Box direction="row" gap="small" align="center" onClick={onManageCollaborators}>
          {articleCollaborators.length > 0 && (
            <StackedAvatar size="md" userData={articleCollaborators} maxAvatars={4} />
          )}
          <Text size="large" color={articleCollaborators.length > 0 ? 'primaryText' : 'accentText'}>
            {articleCollaborators.length > 0 ? collaboratingLabel : inviteCollaboratorsLabel}
          </Text>
        </Box>
        <Box direction="row" justify="end" align="center" gap="small">
          <Button
            slimBorder={true}
            size="large"
            height={2.5}
            label={saveDraftLabel}
            onClick={onSaveDraft}
          />
          <Button
            slimBorder={true}
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
