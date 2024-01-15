import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ChevronLeftIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ArticleEditorCard from '../components/article-editor-card';

const ArticleEditor: React.FC<unknown> = () => {
  const { navigateToModal } = useRootComponentProps();
  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleManageCollaborators = () => {
    navigateToModal({ name: 'manage-collaborators' });
  };

  return (
    <Card>
      <Stack direction="row" fullWidth={true} customStyle="p-4">
        <button onClick={handleNavigateBack}>
          <Icon icon={<ChevronLeftIcon />} />
        </button>

        <Text variant="h2">{t('Article Editor')}</Text>
      </Stack>
      <ArticleEditorCard
        inviteCollaboratorsLabel={t('Invite collaborators')}
        collaboratingLabel={t('Collaborating')}
        saveDraftLabel={t('Save draft')}
        actionLabel={t('Publish')}
        canPublish={true}
        onManageCollaborators={handleManageCollaborators}
        onSaveDraft={() => null}
        onPublish={() => null}
      />
    </Card>
  );
};

export default ArticleEditor;
