import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import EditorToolbar from '@akashaorg/design-system-components/lib/components/EditorToolbar';

import ArticleEditorCard from '../components/article-editor-card';

const ArticleEditor: React.FC<RootComponentProps> = props => {
  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleManageCollaborators = () => {
    props.navigateToModal({ name: 'manage-collaborators' });
  };

  const handleSaveDraft = () => {
    /** do something */
  };

  const handlePublish = () => {
    /** do something */
  };

  return (
    <Card>
      <Box customStyle="flex flex-row p-4 w-full">
        <button onClick={handleNavigateBack}>
          <Icon type="ChevronLeftIcon" />
        </button>

        <Text variant="h2">{t('Article Editor')}</Text>
      </Box>
      <EditorToolbar
        onBoldClick={() => {
          return;
        }}
        onItalicClick={() => {
          return;
        }}
        onStrikeThroughClick={() => {
          return;
        }}
        onUnderlineClick={() => {
          return;
        }}
      />
      <ArticleEditorCard
        inviteCollaboratorsLabel={t('Invite collaborators')}
        collaboratingLabel={t('Collaborating')}
        saveDraftLabel={t('Save draft')}
        publishLabel={t('Publish')}
        canPublish={true}
        onManageCollaborators={handleManageCollaborators}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </Card>
  );
};

export default ArticleEditor;
