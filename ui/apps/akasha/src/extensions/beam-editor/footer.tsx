import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { PlusIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { uiState } from './beam-editor';

export interface FooterProps {
  uiState: uiState;
  handleBeamPublish: () => void;
  handleClickAddBlock: () => void;
  handleClickTags: () => void;
  handleClickSave: () => void;
  handleClickCancel: () => void;
  blocksLabel?: string;
  tagsLabel?: string;
  publishLabel?: string;
  saveTagsLabel?: string;
  addBlockLabel?: string;
  cancelLabel?: string;
  blocksNumber?: number;
  maxBlocks?: number;
  tagsNumber?: number;
  maxTags?: number;
  disableTagsSave?: boolean;
  disableBeamPublishing?: boolean;
}

export const Footer: React.FC<FooterProps> = props => {
  const {
    uiState,
    handleClickSave,
    handleClickAddBlock,
    handleClickTags,
    handleBeamPublish,
    handleClickCancel,
    blocksLabel,
    tagsLabel,
    publishLabel,
    saveTagsLabel,
    addBlockLabel,
    cancelLabel,
    blocksNumber = 0,
    maxBlocks = 10,
    tagsNumber = 0,
    maxTags = 10,
    disableTagsSave = false,
    disableBeamPublishing = false,
  } = props;

  const renderContent = () => {
    switch (uiState) {
      case 'blocks':
        return (
          <>
            <Text
              variant="footnotes2"
              color="grey7"
            >{`${blocksNumber}/${maxBlocks} ${blocksLabel}`}</Text>
            <Button variant="secondary" label={cancelLabel} onClick={handleClickCancel} />
          </>
        );
      case 'tags':
        return (
          <>
            <Text
              variant="footnotes2"
              color="grey7"
            >{`${tagsNumber}/${maxTags} ${tagsLabel}`}</Text>
            <Stack direction="row" spacing="gap-2">
              <Button variant="text" label={cancelLabel} onClick={handleClickCancel} />
              <Button
                variant="primary"
                disabled={disableTagsSave}
                label={saveTagsLabel}
                onClick={handleClickSave}
              />
            </Stack>
          </>
        );
      default:
        return (
          <>
            <Button
              onClick={handleClickAddBlock}
              icon={<PlusIcon />}
              iconDirection="left"
              variant="text"
              greyBg={true}
              label={addBlockLabel}
            />
            <Stack direction="row" spacing="gap-4" align="center">
              <Stack direction="row" spacing="gap-2" align="center">
                <Stack
                  align="center"
                  justify="center"
                  customStyle="w-[18px] h-[18px] rounded-[3px]"
                  background={{ light: 'grey9', dark: 'grey5' }}
                >
                  <Text
                    variant="footnotes2"
                    color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  >
                    {tagsNumber}
                  </Text>
                </Stack>
                <Button variant="text" label={tagsLabel} onClick={handleClickTags} />
              </Stack>
              <Button
                variant="primary"
                disabled={disableBeamPublishing}
                label={publishLabel}
                onClick={handleBeamPublish}
              />
            </Stack>
          </>
        );
    }
  };

  return (
    <Stack
      padding={16}
      fullWidth
      justify="between"
      align="center"
      direction="row"
      customStyle="rounded-b-2xl"
    >
      {renderContent()}
    </Stack>
  );
};
