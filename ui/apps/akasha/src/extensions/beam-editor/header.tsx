import * as React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import { uiState } from './beam-editor';

export interface HeaderProps {
  uiState: uiState;
  handleNsfwCheckbox: () => void;
  isNsfw: boolean;
  indeterminate: boolean;
  addBlockLabel?: string;
  addTagsLabel?: string;
  beamEditorLabel?: string;
}

export const Header: React.FC<HeaderProps> = props => {
  const {
    uiState,
    indeterminate,
    handleNsfwCheckbox,
    isNsfw,
    addBlockLabel,
    addTagsLabel,
    beamEditorLabel,
  } = props;

  const renderTitle = () => {
    switch (uiState) {
      case 'blocks':
        return addBlockLabel;
      case 'tags':
        return addTagsLabel;
      default:
        return beamEditorLabel;
    }
  };

  return (
    <Stack
      padding={16}
      justify={uiState === 'editor' ? 'between' : 'center'}
      direction="row"
      align="center"
    >
      <Text variant="h4">{renderTitle()}</Text>

      {uiState === 'editor' && (
        <Checkbox
          id="nsfw"
          label={'NSFW'}
          name="nsfw"
          value="nsfw"
          handleChange={handleNsfwCheckbox}
          isSelected={isNsfw}
          indeterminate={indeterminate}
        />
      )}
    </Stack>
  );
};
