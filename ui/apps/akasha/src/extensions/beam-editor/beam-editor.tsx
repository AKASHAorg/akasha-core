import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useBlocksPublishing } from './use-blocks-publishing';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  CheckIcon,
  TrashIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { ContentBlockModes } from '@akashaorg/typings/lib/ui';

import { Header } from './header';
import { Footer } from './footer';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';

export type uiState = 'editor' | 'tags' | 'blocks';

export const BeamEditor: React.FC = () => {
  const { t } = useTranslation('app-akasha-integration');

  const {
    availableBlocks,
    createContentBlocks,
    isPublishing,
    blocksInUse,
    addBlockToList,
    removeBlockFromList,
  } = useBlocksPublishing();

  const onBlockSelectAfter = newSelection => {
    if (!newSelection?.propertyType) {
      return;
    }
    addBlockToList({ propertyType: newSelection.propertyType, appName: newSelection.appName });
  };

  const handleBeamPublish = () => {
    createContentBlocks();
  };

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

  const [selectedBlock, setSelectedBlock] = React.useState(null);

  const handleAddBlock = () => {
    const newBlock = availableBlocks.find(
      block => block.propertyType === selectedBlock.propertyType,
    );
    onBlockSelectAfter(newBlock);
    setUiState('editor');
    setSelectedBlock(null);
  };

  const [tagValue, setTagValue] = React.useState('');
  const [editorTags, setEditorTags] = React.useState([]);

  const handleAddTags = () => {
    setEditorTags(prev => {
      const removeDuplicates = new Set([...prev, tagValue]);
      return [...removeDuplicates];
    });
    setTagValue('');
  };

  const handleDeleteTag = tag => {
    setEditorTags(prev => {
      const filtered = new Set(prev.filter(elem => tag !== elem));
      return [...filtered];
    });
  };

  return (
    <Card customStyle="divide(y grey9 dark:grey3)" padding={0}>
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
              <Stack padding={16} direction="column" spacing="gap-2">
                <Stack direction="row" justify="between">
                  <Stack
                    align="center"
                    justify="center"
                    customStyle={
                      'h-6 w-6 group relative rounded-full bg(secondaryLight dark:secondaryDark)'
                    }
                  >
                    {/* <Icon size="xs" type={block.icon} /> */}
                  </Stack>
                  <button onClick={() => removeBlockFromList(block.order)}>
                    <Stack
                      align="center"
                      justify="center"
                      customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey3)'}
                    >
                      <Icon
                        icon={<TrashIcon />}
                        size="xs"
                        color={{ light: 'errorLight', dark: 'errorDark' }}
                      />
                    </Stack>
                  </button>
                </Stack>
                <ContentBlockExtension
                  editMode={{
                    appName: block.appName,
                    propertyType: block.propertyType,
                  }}
                  mode={ContentBlockModes.EDIT}
                  blockRef={block.blockRef}
                />
              </Stack>
            </div>
          ))}
        </Stack>
        <Stack
          background={{ light: 'white', dark: 'grey2' }}
          customStyle={`absolute top-0 left-0 h-full w-full z-1 divide-y ${
            uiState === 'blocks' ? 'flex' : 'hidden'
          }`}
        >
          {availableBlocks.map((block, idx) => (
            <button key={idx} onClick={() => setSelectedBlock(block)}>
              <Stack
                padding={16}
                customStyle="w-full"
                direction="row"
                justify="between"
                background={
                  block.propertyType === selectedBlock?.propertyType && {
                    light: 'grey8',
                    dark: 'grey3',
                  }
                }
              >
                <Stack direction="row" spacing="gap-1">
                  {/* <Icon type={block.icon} /> */}
                  <Text>{block.displayName}</Text>
                </Stack>
                {block.propertyType === selectedBlock?.propertyType && (
                  <Icon icon={<CheckIcon />} accentColor={true} />
                )}
              </Stack>
            </button>
          ))}
        </Stack>
        <Stack
          background={{ light: 'white', dark: 'grey2' }}
          customStyle={`absolute top-0 left-0 h-full w-full z-1 ${
            uiState === 'tags' ? 'flex' : 'hidden'
          }`}
        >
          <Stack padding={16} spacing="gap-2">
            <Text variant="h6">{t('Beam Tags')}</Text>
            <Text variant="subtitle2">
              {t(
                'Use up to 10 tags to categorize your posts on AKASHA World, helping others discover your content more easily.',
              )}
            </Text>
            <TextField
              value={tagValue}
              onChange={e => setTagValue(e.currentTarget.value)}
              placeholder={t('Search for tags')}
              type="text"
            />
            {editorTags.length === 0 && (
              <Text variant="body2">{t('You haven’t added any tags yet')}</Text>
            )}
            <Stack direction="row" spacing="gap-2" customStyle="flex-wrap mt-2">
              {editorTags.length > 0 &&
                editorTags.map((tag, index) => (
                  <Pill
                    key={index}
                    label={tag}
                    icon={<XMarkIcon />}
                    iconDirection="right"
                    onPillClick={() => handleDeleteTag(tag)}
                  />
                ))}
            </Stack>
          </Stack>
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
        cancelLabel={t('Close')}
        blocksLabel={t('Blocks')}
        tagsLabel={t('Tags')}
        publishLabel={t('Beam it')}
        blocksNumber={blocksInUse.length}
        tagsNumber={editorTags.length}
        isPublishing={isPublishing}
      />
    </Card>
  );
};
