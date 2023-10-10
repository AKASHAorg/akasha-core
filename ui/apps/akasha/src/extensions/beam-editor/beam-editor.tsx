import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocksPublishing } from './use-blocks-publishing';
import { useGetMyProfileQuery } from '@akashaorg/ui-awf-hooks/lib/generated/hooks-new';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import List from '@akashaorg/design-system-core/lib/components/List';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';

import { Header } from './header';
import { Footer } from './footer';

export type uiState = 'editor' | 'tags' | 'blocks';

export const BeamEditor: React.FC = () => {
  const { t } = useTranslation('app-akasha-integration');

  const { availableBlocks, createContentBlocks, isPublishing, blocksInUse, addBlockToList } =
    useBlocksPublishing();

  const onBlockSelectAfter = (after: number) => newSelection => {
    if (!newSelection.id) {
      return;
    }
    addBlockToList({ id: newSelection.id, appName: newSelection.appName }, after);
  };

  const handleBeamPublish = () => {
    createContentBlocks();
  };

  const profileDataReq = useGetMyProfileQuery(null, {
    select: resp => {
      return resp.viewer?.akashaProfile;
    },
  });
  const loggedProfileData = profileDataReq.data;

  const [uiState, setUiState] = React.useState<uiState>('editor');
  const [isNsfw, setIsNsfw] = React.useState(false);

  const handleNsfwCheckbox = () => {
    setIsNsfw(!isNsfw);
  };

  const handleAddBlockBtn = () => {
    setUiState('blocks');
  };

  const handleTagsBtn = () => {
    setUiState('tags');
  };

  const handleClickCancel = () => {
    setUiState('editor');
  };

  const [selectedBlock, setSelectedBlock] = React.useState('');

  const handleAddBlock = () => {
    const newBlock = availableBlocks.find(block => block.displayName === selectedBlock);
    onBlockSelectAfter(blocksInUse.length - 1)(newBlock);
  };

  const handleSelectBlock = ({ index, label }) => {
    setSelectedBlock(label);
  };

  const [tagSelection, setTagSelection] = React.useState([]);
  const [editorTags, setEditorTags] = React.useState([]);

  const handleAddTags = () => {
    setEditorTags(tagSelection);
  };

  return (
    <Card customStyle="divide(y grey9 dark:grey3)" padding={0} margin="m-4">
      <Header
        addBlockLabel={t('Add a Block')}
        beamEditorLabel={t('Beam Editor')}
        addTagsLabel={t('Add Tags')}
        isNsfw={isNsfw}
        handleNsfwCheckbox={handleNsfwCheckbox}
        uiState={uiState}
      />
      <Stack customStyle="relative">
        <Stack>
          {blocksInUse.map((block, idx) => (
            <div key={`${block.propertyType}-${idx}`} id={`${block.propertyType}-${idx}`}>
              <ContentBlockExtension
                editMode={{
                  appName: block.appName,
                  propertyType: block.propertyType,
                }}
                mode={ContentBlockModes.EDIT}
                blockRef={block.blockRef}
              />
            </div>
          ))}
        </Stack>
        <Stack
          customStyle={`absolute top-0 left-0 h-full z-10 ${
            uiState === 'blocks' ? 'flex' : 'hidden'
          }`}
        >
          <List
            items={availableBlocks.map(block => ({
              id: block.propertyType,
              icon: block.icon,
              label: block.displayName,
              appName: block.appName,
            }))}
            showDivider={true}
            onSelected={handleSelectBlock}
          />
        </Stack>
      </Stack>
      <Footer
        uiState={uiState}
        handleClickAddBlock={handleAddBlockBtn}
        handleClickTags={handleTagsBtn}
        handleClickCancel={handleClickCancel}
        handleAddBlock={handleAddBlock}
        handleAddTags={handleAddTags}
        handleBeamPublish={handleBeamPublish}
        addBlockLabel={t('Add a Block')}
        addLabel={t('Add')}
        cancelLabel={t('Cancel')}
        blocksLabel={t('Blocks')}
        tagsLabel={t('Tags')}
        publishLabel={t('Beam it')}
        blocksNumber={availableBlocks.length}
      />
    </Card>
  );
};
