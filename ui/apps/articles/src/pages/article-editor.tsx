import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { RootComponentProps } from '@akashaorg/typings/ui';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import ArticleEditorCard from '../components/article-editor-card';

const ArticleEditor: React.FC<RootComponentProps> = props => {
  const [dropOpen, setDropOpen] = React.useState<string | null>(null);
  const [caseStyle, setCaseStyle] = React.useState<string>('textcaseSentence');
  const [listStyle, setListStyle] = React.useState<string>('listBulleted');

  const [alignStyle, setAlignStyle] = React.useState<string>('alignLeft');

  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const handleNavigateBack = () => {
    navigate(-1);
  };

  const handleIconClick = (iconType: string) => {
    switch (dropOpen) {
      case 'align':
        setAlignStyle(iconType);
        setDropOpen(null);
        break;
      case 'list':
        setListStyle(iconType);
        setDropOpen(null);
        break;
      case 'case':
        setCaseStyle(iconType);
        setDropOpen(null);
        break;
      default:
        setDropOpen(null);
        break;
    }
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
    <BasicCardBox>
      <Box customStyle="flex flex-row p-4 w-full">
        <button onClick={handleNavigateBack}>
          <Icon type="ChevronLeftIcon" />
        </button>

        <Text variant="h2">{t('Article Editor')}</Text>
      </Box>
      {/* <EditorToolbar
        dropOpen={dropOpen}
        caseStyle={caseStyle}
        listStyle={listStyle}
        alignStyle={alignStyle}
        wrapperBorder={{ side: 'horizontal', color: 'border' }}
        closeDrop={() => setDropOpen(null)}
        onDropOpen={type => setDropOpen(type)}
        onBoldClick={() => {
          return;
        }}
        onItalicClick={() => {
          return;
        }}
        onUnderlineClick={() => {
          return;
        }}
        onStrikeThroughClick={() => {
          return;
        }}
        onIconClick={handleIconClick}
      /> */}
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
    </BasicCardBox>
  );
};

export default ArticleEditor;
