import * as React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { AddBlockButtonProps, AddBlock } from './add-block-button';
import { EditorUIState } from '../types';
export type TFooterProps = AddBlockButtonProps & {
  uiState: EditorUIState;
  tagsLabel: string;
  blocksLabel: string;
  publishLabel: string;
  saveTagsLabel: string;
  cancelLabel: string;
  maxBlocksWarningLabel: string;
  maxTags: number;
  maxBlocks: number;
  tagsNumber: number;
  blocksNumber: number;
  disableAddBlock: boolean;
  disableTagsSave: boolean;
  disableBeamPublishing: boolean;
  handleClickTags: () => void;
  handleClickSave: () => void;
  handleClickCancel: () => void;
  handleBeamPublish: () => void;
};
export const Footer: React.FC<TFooterProps> = props => {
  const {
    uiState,
    tagsLabel,
    blocksLabel,
    publishLabel,
    saveTagsLabel,
    cancelLabel,
    addBlockLabel,
    maxBlocksWarningLabel,
    maxTags,
    maxBlocks,
    tagsNumber,
    blocksNumber,
    disableAddBlock,
    disableTagsSave,
    disableBeamPublishing,
    handleClickTags,
    handleClickSave,
    handleClickCancel,
    handleBeamPublish,
    handleClickAddBlock,
  } = props;
  return (
    <Stack
      justifyContent="between"
      alignItems="center"
      direction="row"
      className="p-4 w-full rounded-b-2xl mt-auto"
    >
      {/* render content based on the value of uiState */}
      {uiState === 'blocks' && (
        <>
          <Typography
            variant="xs"
            className="font-medium text-grey7"
          >{`${blocksNumber}/${maxBlocks} ${blocksLabel}`}</Typography>
          <Button variant="outline" onClick={handleClickCancel}>
            {cancelLabel}
          </Button>
        </>
      )}
      {uiState === 'tags' && (
        <>
          <Typography
            variant="xs"
            className="font-medium text-grey7"
          >{`${tagsNumber}/${maxTags} ${tagsLabel}`}</Typography>
          <Stack direction="row" spacing={2}>
            <Button variant="link" onClick={handleClickCancel}>
              {cancelLabel}
            </Button>
            <Button disabled={disableTagsSave} onClick={handleClickSave}>
              {saveTagsLabel}
            </Button>
          </Stack>
        </>
      )}
      {uiState === 'editor' && (
        <>
          {disableAddBlock && (
            <Tooltip
              placement="top"
              content={maxBlocksWarningLabel}
              trigger="hover"
              contentCustomStyle="w-75"
            >
              <AddBlock disabled={disableAddBlock} addBlockLabel={addBlockLabel} />
            </Tooltip>
          )}
          {!disableAddBlock && (
            <AddBlock addBlockLabel={addBlockLabel} handleClickAddBlock={handleClickAddBlock} />
          )}
          <Stack direction="row" spacing={4} alignItems="center">
            <Stack direction="row" spacing={2} alignItems="center">
              <Stack
                alignItems="center"
                justifyContent="center"
                className="w-[18px] h-[18px] rounded-[3px] bg-card"
              >
                <Typography
                  variant="xs"
                  className="font-medium text-secondaryLight dark:text-secondaryDark"
                >
                  {tagsNumber}
                </Typography>
              </Stack>
              <Button variant="link" onClick={handleClickTags}>
                {tagsLabel}
              </Button>
            </Stack>
            <Button disabled={disableBeamPublishing} onClick={handleBeamPublish}>
              {publishLabel}
            </Button>
          </Stack>
        </>
      )}
    </Stack>
  );
};
