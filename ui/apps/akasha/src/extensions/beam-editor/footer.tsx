import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { uiState } from './beam-editor';

export interface FooterProps {
  uiState: uiState;
  handleBeamPublish: () => void;
  handleClickAddBlock: () => void;
  handleClickTags: () => void;
  handleAddBlock: () => void;
  handleAddTags: () => void;
  handleClickCancel: () => void;
  isPublishing?: boolean;
  tagsLabel?: string;
  publishLabel?: string;
  addLabel?: string;
  addBlockLabel?: string;
  cancelLabel?: string;
  blocksLabel?: string;
  blocksNumber?: number;
  tagsNumber?: number;
}

export const Footer: React.FC<FooterProps> = props => {
  const {
    uiState,
    handleAddBlock,
    handleAddTags,
    handleClickAddBlock,
    handleClickTags,
    handleBeamPublish,
    handleClickCancel,
    addLabel,
    addBlockLabel,
    tagsLabel,
    publishLabel,
    cancelLabel,
    blocksLabel,
    blocksNumber = 0,
    tagsNumber = 0,
    isPublishing,
  } = props;

  const renderContent = () => {
    switch (uiState) {
      case 'blocks':
        return (
          <>
            <Text>{`${blocksNumber}/10 ${blocksLabel}`}</Text>
            <Stack direction="row" spacing="gap-2">
              <Button variant="text" label={cancelLabel} onClick={handleClickCancel} />
              <Button
                variant="primary"
                disabled={isPublishing}
                label={addLabel}
                onClick={handleAddBlock}
              />
            </Stack>
          </>
        );
      case 'tags':
        return (
          <>
            <Text>{`${tagsNumber}/10 ${tagsLabel}`}</Text>
            <Stack direction="row" spacing="gap-2">
              <Button variant="text" label={cancelLabel} onClick={handleClickCancel} />
              <Button
                variant="primary"
                disabled={isPublishing}
                label={addLabel}
                onClick={handleAddTags}
              />
            </Stack>
          </>
        );
      default:
        return (
          <>
            <Button
              onClick={handleClickAddBlock}
              icon="PlusIcon"
              iconDirection="left"
              variant="text"
              greyBg={true}
              label={addBlockLabel}
            />
            <Stack direction="row" spacing="gap-2">
              <Button variant="text" label={tagsLabel} onClick={handleClickTags} />
              <Button
                variant="primary"
                disabled={isPublishing}
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
      direction="row"
      customStyle="absolute bottom-0 left-0 rounded-b-xl"
      background={{ light: 'white', dark: 'grey2' }}
    >
      {renderContent()}
    </Stack>
  );
};
