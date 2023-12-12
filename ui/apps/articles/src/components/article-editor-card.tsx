import React from 'react';
import { withHistory } from 'slate-history';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact } from 'slate-react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import StackedAvatar from '@akashaorg/design-system-core/lib/components/StackedAvatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { articles } from './dummy-data';
import { transformSource } from '@akashaorg/ui-awf-hooks';

export interface IArticleEditorCardProps {
  inviteCollaboratorsLabel: string;
  collaboratingLabel: string;
  saveDraftLabel: string;
  actionLabel: string;
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
    actionLabel,
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
      <Stack spacing="gap-4" customStyle="px-4 my-4 max-h-[73vh] overflow-y-scroll">
        {/* slate editors for the article title and content */}
        <Slate editor={titleEditor} value={initialValue} onChange={() => null}>
          <Editable placeholder="Your Title" />
        </Slate>
        <Slate editor={contentEditor} value={initialValue} onChange={() => null}>
          <Editable placeholder="Start sharing knowledge" />
        </Slate>
      </Stack>
      <Stack justify="between" customStyle="p-4 border(t grey8 dark:grey3)">
        <button onClick={onManageCollaborators}>
          <Stack direction="row" spacing="gap-2" align="center">
            {articleCollaborators.length > 0 && (
              <StackedAvatar
                size="md"
                userData={articleCollaborators.map(item => ({
                  ...item,
                  avatar: transformSource(item.avatar?.default),
                  alternativeAvatars: item.avatar?.alternatives?.map(alternative =>
                    transformSource(alternative),
                  ),
                }))}
                maxAvatars={4}
              />
            )}
            <Text
              variant="h6"
              color={
                articleCollaborators.length > 0 && {
                  light: 'secondaryLight',
                  dark: 'secondaryDark',
                }
              }
            >
              {articleCollaborators.length > 0 ? collaboratingLabel : inviteCollaboratorsLabel}
            </Text>
          </Stack>
        </button>
        <Stack direction="row" justify="end" align="center" spacing="gap-2">
          <Button size="lg" label={saveDraftLabel} onClick={onSaveDraft} />
          <Button
            size="lg"
            disabled={!canPublish}
            variant="primary"
            label={actionLabel}
            onClick={onPublish}
          />
        </Stack>
      </Stack>
    </>
  );
};

export default ArticleEditorCard;
