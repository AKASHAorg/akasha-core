import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import EditorToolbar from '../components/toolbar';
import ArticleEditorCard from '../components/article-editor-card';

const { Box, Icon, MainAreaCardBox, Text } = DS;

const ArticleEditor: React.FC<RootComponentProps> = () => {
  const [fontColor] = React.useState('blue');

  const navigate = useNavigate();
  const { t } = useTranslation('app-articles');

  const handleClickIcon = () => {
    navigate(-1);
  };

  const handleEmojiIconClick = () => {
    /** do something */
  };

  const handleSaveDraft = () => {
    /** do something */
  };

  const handlePublish = () => {
    /** do something */
  };

  return (
    <MainAreaCardBox>
      <Box direction="row" pad="medium" fill="horizontal">
        <Icon type="chevronLeft" style={{ cursor: 'pointer' }} onClick={handleClickIcon} />
        <Text size="xlarge" weight="bold">
          {t('Article Editor')}
        </Text>
      </Box>
      <EditorToolbar
        fontColor={fontColor}
        onEmojiIconClick={handleEmojiIconClick}
        onFontColorClick={() => {
          /** */
        }}
        onTextCaseClick={() => {
          /** */
        }}
        onBoldClick={() => {
          /** */
        }}
        onItalicClick={() => {
          /** */
        }}
        onUnderlineClick={() => {
          /** */
        }}
        onStrikeThroughClick={() => {
          /** */
        }}
        onListStyleClick={() => {
          /** */
        }}
        onAlignStyleClick={() => {
          /** */
        }}
      />
      <ArticleEditorCard
        collaboratingLabel={t('Collaborating')}
        saveDraftLabel={t('Save draft')}
        publishLabel={t('Publish')}
        canPublish={true}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
      />
    </MainAreaCardBox>
  );
};

export default ArticleEditor;
