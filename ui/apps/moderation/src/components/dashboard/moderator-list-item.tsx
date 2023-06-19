import React from 'react';

import { Profile } from '@akashaorg/typings/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ModeratorListItemProps = {
  assignButtonLabel: string;
  assignedAdmin: boolean;
  selectedModerator: Profile;
  activeModerators: Profile[];
  onClickAssign: () => void;
};

const ModeratorListItem: React.FC<ModeratorListItemProps> = props => {
  const { assignButtonLabel, activeModerators, selectedModerator, assignedAdmin, onClickAssign } =
    props;

  if (assignedAdmin) {
    return (
      <Box customStyle="flex space-x-2 items-center">
        <Avatar avatar={selectedModerator.avatar} />

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
          >{`@${selectedModerator.name}`}</Text>
        </Box>
      </Box>
    );
  }

  return (
    <Box customStyle="space-y-4">
      {activeModerators.map((moderator, idx) => (
        <React.Fragment key={moderator.name}>
          <Box customStyle="flex justify-between">
            <Box customStyle="flex space-x-2 items-center">
              <Avatar avatar={moderator.avatar} />

              <Box>
                <Text variant="button-md" weight="bold" truncate={true}>{`${moderator.name}`}</Text>

                <Text
                  variant="footnotes2"
                  weight="normal"
                  truncate={true}
                  color={{ light: 'grey4', dark: 'grey7' }}
                >{`@${moderator.did.id}`}</Text>
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
