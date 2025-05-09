import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Checkbox } from '@akashaorg/ui/lib/components/checkbox';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { EditorUIState } from './types';

export interface HeaderProps {
  uiState: EditorUIState;
  addTagsLabel?: string;
  addBlockLabel?: string;
  beamEditorLabel?: string;
  checkboxIsSelected: boolean;
  checkboxIsDisabled: boolean;
  onSelectCheckbox: () => void;
}

export const Header: React.FC<HeaderProps> = props => {
  const {
    uiState,
    addTagsLabel,
    addBlockLabel,
    beamEditorLabel,
    checkboxIsSelected,
    checkboxIsDisabled,
    onSelectCheckbox,
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
      justifyContent={uiState === 'editor' ? 'between' : 'center'}
      direction="row"
      alignItems="center"
      className="p-4 rounded-t-2xl"
    >
      <Text variant="h4">{renderTitle()}</Text>
      {uiState === 'editor' && (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Checkbox
            id="nsfw"
            name="nsfw"
            value="nsfw"
            onCheckedChange={onSelectCheckbox}
            checked={checkboxIsSelected}
            disabled={checkboxIsDisabled}
          />
          <label htmlFor="nsfw">
            <Typography variant="sm">NSFW</Typography>
          </label>
        </Stack>
      )}
    </Stack>
  );
};
