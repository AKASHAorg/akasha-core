import * as React from 'react';
import { useTranslation } from 'react-i18next';

import { useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { type ContentBlock, ContentBlockModes } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import {
  TrashIcon,
  XMarkIcon,
} from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ContentBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { Header } from './header';
import { Footer } from './footer';
import { useBlocksPublishing } from './use-blocks-publishing';

export type uiState = 'editor' | 'tags' | 'blocks';

export const BeamEditor: React.FC = () => {
  const { t } = useTranslation('app-akasha-integration');
  const { getRoutingPlugin } = useRootComponentProps();
  const {
    availableBlocks,
    createContentBlocks,
    isPublishing,
    blocksInUse,
    addBlockToList,
    removeBlockFromList,
  } = useBlocksPublishing({
    onComplete: beamData => {
      getRoutingPlugin().navigateTo({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Beam}/${beamData.document.id}`,
      });
    },
  });

  const [uiState, setUiState] = React.useState<uiState>('editor');
  const [isNsfw, setIsNsfw] = React.useState(false);

  const [tagValue, setTagValue] = React.useState('');
  const [editorTags, setEditorTags] = React.useState([]);
  const [newTags, setNewTags] = React.useState([]);
  const [errorMessage, setErrorMessage] = React.useState(null);

  const onBlockSelectAfter = (newSelection: ContentBlock) => {
    if (!newSelection?.propertyType) {
      return;
    }
    addBlockToList({ propertyType: newSelection.propertyType, appName: newSelection.appName });
  };

  const handleBeamPublish = () => {
    createContentBlocks(isNsfw, editorTags);
  };

  const bottomRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (blocksInUse.length) {
      bottomRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [blocksInUse]);

  React.useEffect(() => {
    if (newTags.length === 10) {
      setErrorMessage('Tags limit reached');
    } else if (tagValue.length > 30) {
      setErrorMessage('Tag is over the 30 characters limit');
    } else if (newTags.includes(tagValue)) {
      setErrorMessage('Tag added already, please try a different one');
    } else {
      setErrorMessage(null);
    }
  }, [tagValue, newTags]);

  const handleNsfwCheckbox = () => {
    setIsNsfw(!isNsfw);
  };

  const handleAddBlockBtn = () => {
    setUiState('blocks');
  };

  const handleTagsBtn = () => {
    setUiState('tags');

    /**
     * copy existing tags, if any,
     * to new tags state
     */
    if (editorTags.length > 0) {
      setNewTags(editorTags);
    }
  };

  const handleAddBlock = selectedBlock => {
    const newBlock = availableBlocks.find(
      block =>
        block.propertyType === selectedBlock.propertyType &&
        block.appName === selectedBlock.appName,
    );
    onBlockSelectAfter(newBlock);
    setUiState('editor');
  };

  const targetKeys = [' ', ',', 'Enter'];
  const targetCodes = ['Space', 'Comma', 'Enter'];

  const allTags = [...new Set([...editorTags, ...newTags])];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tag = e.currentTarget.value;
    if (targetKeys.includes(tag.charAt(tag.length - 1))) return;
    setTagValue(tag);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (targetKeys.includes(e.key) || targetCodes.includes(e.code)) {
      addTag();
    }
  };

  const addTag = () => {
    /**
     * if tag length is at least 2 and total number of tags
     * is less than max specified and tag is not previously
     * added
     */
    if (
      tagValue.length > 2 &&
      tagValue.length <= 30 &&
      allTags.length < 10 &&
      !newTags.includes(tagValue)
    ) {
      setNewTags(prev => [...prev, tagValue]);
      setTagValue('');
    }
  };

  const handleDeleteTag = (tag: string) => {
    if (newTags.includes(tag)) {
      setNewTags(newTags.filter(_tag => _tag !== tag));
    }
  };

  const handleClickSave = () => {
    setEditorTags(newTags);
    setNewTags([]);
    setUiState('editor');
  };

  const handleClickCancel = () => {
    /**
     * if uiState is 'tags', reset newTags and tagValue states,
     * then set uiState to 'editor'
     */
    if (uiState === 'tags') {
      setNewTags([]);
      setTagValue('');
    }
    setUiState('editor');
  };

  const [disablePublishing, setDisablePublishing] = React.useState(false);
  const handleDisablePublishing = (value: boolean) => {
    setDisablePublishing(value);
  };

  return (
    <Card customStyle="divide(y grey9 dark:grey3) h-[80vh] justify-between" padding={0}>
      <Header
        addBlockLabel={t('Add a Block')}
        beamEditorLabel={t('Beam Editor')}
        addTagsLabel={t('Add Tags')}
        isNsfw={isNsfw}
        handleNsfwCheckbox={handleNsfwCheckbox}
        uiState={uiState}
      />
      <Stack customStyle="relative h-full overflow-hidden">
        <Stack customStyle="overflow-auto h-full">
          {blocksInUse.map((block, idx) => (
            <div key={`${block.key}`} id={`${block.propertyType}-${idx}`}>
              <Stack padding={16} direction="column" spacing="gap-2">
                <Stack direction="row" justify="between">
                  <Stack
                    align="center"
                    justify="center"
                    customStyle={
                      'h-6 w-6 group relative rounded-full bg(secondaryLight/30 dark:secondaryDark)'
                    }
                  >
                    <Icon size="xs" icon={block.icon} />
                  </Stack>
                  <button onClick={() => removeBlockFromList(block.order)}>
                    <Stack
                      align="center"
                      justify="center"
                      customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey5)'}
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
                    externalHandler: handleDisablePublishing,
                  }}
                  mode={ContentBlockModes.EDIT}
                  blockRef={block.blockRef}
                />
              </Stack>
            </div>
          ))}
          <div ref={bottomRef} />
        </Stack>
        <Stack
          background={{ light: 'white', dark: 'grey2' }}
          customStyle={`absolute overflow-auto top-0 left-0 h-full w-full z-1 divide(y grey8 dark:grey5) ${
            uiState === 'blocks' ? 'flex' : 'hidden'
          }`}
        >
          {blocksInUse.length > 9 && (
            <button onClick={handleClickCancel}>
              <Stack padding={32} align="center" justify="center" fullWidth>
                <Text>{t('You have reached the maximum number of blocks for a beam.')}</Text>
              </Stack>
            </button>
          )}
          {blocksInUse.length < 10 &&
            availableBlocks.map((block, idx) => (
              <button key={idx} onClick={() => handleAddBlock(block)}>
                <Stack padding={16} fullWidth direction="row" justify="between" align="center">
                  <Stack direction="row" align="center" spacing="gap-2">
                    <Stack
                      align="center"
                      justify="center"
                      customStyle={'h-6 w-6 group relative rounded-full bg(grey9 dark:grey5)'}
                    >
                      <Icon size="xs" icon={block.icon} />
                    </Stack>
                    <Text>{block.displayName}</Text>
                  </Stack>
                </Stack>
              </button>
            ))}
        </Stack>
        <Stack
          background={{ light: 'white', dark: 'grey2' }}
          customStyle={`absolute top-0 left-0 h-full w-full z-1 overflow-auto ${
            uiState === 'tags' ? 'flex' : 'hidden'
          }`}
        >
          <Stack padding={16} spacing="gap-4">
            <Stack direction="row" spacing="gap-x-1" align="center">
              <Text variant="h6">{t('Beam Tags')}</Text>
              <Text variant="footnotes2" color="grey7">
                ({t('10 max')}.)
              </Text>
            </Stack>
            <Text variant="subtitle2" color="grey7">
              {t(
                'Use up to 10 tags to categorize your posts on AKASHA World, helping others discover your content more easily.',
              )}
            </Text>
            <Stack spacing="gap-y-1">
              <SearchBar
                inputValue={tagValue}
                inputPlaceholderLabel={t('Search for tags')}
                onInputChange={handleChange}
                onKeyUp={handleKeyUp}
                onSearch={() => {
                  /** */
                }}
                responsive={true}
                customStyle={`${
                  errorMessage
                    ? 'focus-within:border-errorLight dark:focus-within:border-errorDark))'
                    : ''
                }`}
              />

              {errorMessage && (
                <Text variant="footnotes2" color={{ light: 'errorLight', dark: 'errorDark' }}>
                  {t('{{errorMessage}}', { errorMessage })}
                </Text>
              )}
            </Stack>
            {newTags.length === 0 && (
              <Text variant="body2" weight="bold">
                {t("You haven't added any tags yet")}
              </Text>
            )}
            <Stack fullWidth direction="row" align="center" justify="end" spacing="gap-2">
              <Button
                variant="text"
                label={t('Clear All')}
                disabled={!newTags.length}
                onClick={() => setNewTags([])}
              />
              <Button
                variant="secondary"
                label={t('Add')}
                disabled={tagValue.length < 3 || tagValue.length > 30 || newTags.includes(tagValue)}
                onClick={addTag}
              />
            </Stack>
            <Stack direction="row" spacing="gap-2" customStyle="flex-wrap">
              {newTags.map((tag, index) => (
                <Pill
                  key={index}
                  label={tag}
                  active={!editorTags.includes(tag)}
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
        handleClickSave={handleClickSave}
        handleBeamPublish={handleBeamPublish}
        addBlockLabel={t('Add a Block')}
        saveTagsLabel={t('Save')}
        cancelLabel={t('Cancel')}
        blocksLabel={t('Blocks')}
        tagsLabel={t('Tags')}
        publishLabel={t('Beam it')}
        blocksNumber={blocksInUse.length}
        tagsNumber={uiState === 'tags' ? newTags.length : allTags.length}
        disableBeamPublishing={isPublishing || disablePublishing}
        disableTagsSave={isPublishing || JSON.stringify(newTags) === JSON.stringify(editorTags)}
      />
    </Card>
  );
};
