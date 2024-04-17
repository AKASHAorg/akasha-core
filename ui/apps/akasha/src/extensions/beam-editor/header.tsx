import React, { PropsWithChildren } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { uiState } from './beam-editor';

export interface HeaderProps {
  uiState: uiState;
  addBlockLabel?: string;
  addTagsLabel?: string;
  beamEditorLabel?: string;
}

export const Header: React.FC<PropsWithChildren<HeaderProps>> = props => {
  const { uiState, addBlockLabel, addTagsLabel, beamEditorLabel, children } = props;

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
      customStyle="rounded-t-2xl"
    >
      <Text variant="h4">{renderTitle()}</Text>
      {children}
    </Stack>
  );
};
