import React from 'react';
import { ActiveModerator } from '../../utils/dummy-data';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IModeratorListItemProps {
  assignButtonLabel: string;
  showButtons: boolean;
  selectedModerator: ActiveModerator;
  activeModerators: ActiveModerator[];
  onClickAssign: () => void;
}

const ModeratorListItem: React.FC<IModeratorListItemProps> = props => {
  const { assignButtonLabel, activeModerators, selectedModerator, showButtons, onClickAssign } =
    props;

  if (showButtons) {
    return (
      <Box customStyle="flex space-x-2 items-center">
        <Avatar src={selectedModerator.avatar} />

        <Box>
          <Text
            variant="button-md"
            weight="bold"
            truncate={true}
          >{`${selectedModerator.name}`}</Text>

          <Text
            variant="footnotes2"
            weight="normal"
            truncate={true}
            color={{ light: 'grey4', dark: 'grey7' }}
          >{`@${selectedModerator.userName}`}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box customStyle="space-y-4">
      {activeModerators.map((moderator, idx) => (
        <React.Fragment key={moderator.userName}>
          <Box customStyle="flex justify-between">
            <Box customStyle="flex space-x-2 items-center">
              <Avatar src={moderator.avatar} />

              <Box>
                <Text variant="button-md" weight="bold" truncate={true}>{`${moderator.name}`}</Text>

                <Text
                  variant="footnotes2"
                  weight="normal"
                  truncate={true}
                  color={{ light: 'grey4', dark: 'grey7' }}
                >{`@${moderator.userName}`}</Text>
              </Box>
            </Box>

            <Button label={assignButtonLabel} onClick={onClickAssign} />
          </Box>

          {idx < activeModerators.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Box>
  );
};

export default ModeratorListItem;
