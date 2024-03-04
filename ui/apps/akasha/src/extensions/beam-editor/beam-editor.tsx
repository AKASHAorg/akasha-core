import React, { useEffect, useState, useRef, ChangeEvent, KeyboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { hasOwn, useGetLogin, useRootComponentProps } from '@akashaorg/ui-awf-hooks';
import { type ContentBlock } from '@akashaorg/typings/lib/ui';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import { XMarkIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Pill from '@akashaorg/design-system-core/lib/components/Pill';
import SearchBar from '@akashaorg/design-system-components/lib/components/SearchBar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { EditorBlockExtension } from '@akashaorg/ui-lib-extensions/lib/react/content-block';
import { Header } from './header';
import { Footer } from './footer';
import { BlockHeader } from '@akashaorg/design-system-components/lib/components/BlockHeader';
import { useBlocksPublishing } from './use-blocks-publishing';
import { useGetProfileByDidSuspenseQuery } from '@akashaorg/ui-awf-hooks/lib/generated/apollo';

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
    updateBlockDisablePublishState,
  } = useBlocksPublishing({
    onComplete: beamData => {
      getRoutingPlugin().navigateTo({
        appName: '@akashaorg/app-akasha-integration',
        getNavigationUrl: navRoutes => `${navRoutes.Beam}/${beamData.document.id}`,
      });
    },
  });

  const [uiState, setUiState] = useState<uiState>('editor');
  const [isNsfw, setIsNsfw] = useState(false);
  const [tagValue, setTagValue] = useState('');
  const [editorTags, setEditorTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nsfwBlocks, setNsfwBlocks] = useState(new Map<number, boolean>());

  /*
   * get the logged-in user info and info about their profile's NSFW property
   */
  const { data: loginData, loading: authenticating } = useGetLogin();
  const { data } = useGetProfileByDidSuspenseQuery({
    fetchPolicy: 'cache-first',
    variables: {
      id: loginData?.id,
    },
    skip: !loginData?.id || authenticating,
  });

  const { akashaProfile: profileData } =
    data?.node && hasOwn(data.node, 'akashaProfile') ? data.node : { akashaProfile: null };

  useEffect(() => {
    if (profileData?.nsfw) {
      setIsNsfw(true);
    }
  }, [profileData]);

  const onBlockSelectAfter = (newSelection: ContentBlock) => {
    if (!newSelection?.propertyType) {
      return;
    }
    addBlockToList({ propertyType: newSelection.propertyType, appName: newSelection.appName });
  };

  const handleBeamPublish = () => {
    createContentBlocks(isNsfw, editorTags, nsfwBlocks);
  };

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (blocksInUse.length) {
      bottomRef.current?.scrollIntoView({
        behavior: 'auto',
        block: 'end',
      });
    }
    if (blocksInUse.some(block => block.disablePublish === true)) {
      setDisablePublishing(true);
    } else {
      setDisablePublishing(false);
    }
  }, [blocksInUse]);

  const handleNsfwCheckbox = () => {
    /*
     * If the profile is marked as NSFW, Beam NSFW checkbox should be marked as checked by default
     * and the user shouldn't be able to change it
     */
    if (profileData?.nsfw) return;

    setIsNsfw(!isNsfw);
    const numberOfBlocks = blocksInUse.length;
    const newNsfwBlocks = new Map();

    if (!isNsfw) {
      for (let key = 0; key < numberOfBlocks; key++) {
        newNsfwBlocks.set(key, true);
      }
      setNsfwBlocks(newNsfwBlocks);
      return;
    }

    for (let key = 0; key < numberOfBlocks; key++) {
      newNsfwBlocks.set(key, false);
    }
    setNsfwBlocks(newNsfwBlocks);
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const tag = e.currentTarget.value;
    if (targetKeys.includes(tag.charAt(tag.length - 1))) return;
    setTagValue(tag);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (newTags.length === 10) {
      setErrorMessage('Tags limit reached');
    } else if (tagValue.length > 30) {
      setErrorMessage('Tag is over the 30 characters limit');
    } else if (newTags.includes(tagValue)) {
      setErrorMessage('Tag added already, please try a different one');
    } else {
      setErrorMessage(null);
    }
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
    if (errorMessage) {
      setErrorMessage(null);
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

  const [disablePublishing, setDisablePublishing] = useState(false);
  const handleDisablePublishing = (value: boolean) => {
    setDisablePublishing(value);
  };

  const blocksWithActiveNsfw = [...nsfwBlocks].filter(([, value]) => !!value);

  useEffect(() => {
    if (blocksWithActiveNsfw.length && blocksWithActiveNsfw.length >= 1) {
      setIsNsfw(true);
      return;
    }
    /*
     *  If the profile is marked as NSFW, the beam is automatically marked as NSFW,
     *  so there is no need to check for blocks
     */
    if (!profileData?.nsfw) setIsNsfw(false);
  }, [blocksWithActiveNsfw, blocksInUse, profileData?.nsfw]);

  return (
    <Card customStyle="divide(y grey9 dark:grey3) h-[80vh] justify-between" padding={0}>
      <Header
        addBlockLabel={t('Add a Block')}
        beamEditorLabel={t('Beam Editor')}
        addTagsLabel={t('Add Tags')}
        uiState={uiState}
      >
        {uiState === 'editor' && (
          <Checkbox
            id="nsfw"
            label={'NSFW'}
            name="nsfw"
            value="nsfw"
            handleChange={handleNsfwCheckbox}
            isSelected={isNsfw}
            isDisabled={profileData?.nsfw}
          />
        )}
      </Header>
      <Stack customStyle="relative h-full overflow-hidden">
        <Stack customStyle="overflow-auto h-full">
          {blocksInUse.map((block, idx) => (
            <div key={`${block.key}`} id={`${block.propertyType}-${idx}`}>
              <Stack padding={16} direction="column" spacing="gap-2">
                <BlockHeader
                  icon={block.icon}
                  blockCreationStatus={block.status}
                  errorLabel={t('Block creation failed.')}
                  successLabel={t('Block Created Successfully!')}
                  creatingBlockLabel={t('Creating Block...')}
                  retryLabel={t('Retry')}
                  handleRetry={handleBeamPublish}
                  handleRemoveBlock={() => removeBlockFromList(block.order)}
                  handleNsfwChange={() => {
                    setNsfwBlocks(new Map(nsfwBlocks.set(idx, !nsfwBlocks.get(idx))));
                  }}
                  isNsfwCheckboxSelected={!!nsfwBlocks.get(idx)}
                />
                <EditorBlockExtension
                  appName={block.appName}
                  propertyType={block.propertyType}
                  externalHandler={value => updateBlockDisablePublishState(value, block.order)}
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
                      customStyle={'h-8 w-8 group relative rounded-full bg(grey9 dark:grey5)'}
                    >
                      <Icon size="sm" icon={block.icon} />
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
