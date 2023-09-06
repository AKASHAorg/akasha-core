import React from 'react';

import { Profile } from '@akashaorg/typings/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack spacing="gap-x-2" align="center">
        <Avatar avatar={selectedModerator.avatar} />

        <Stack>
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
        </Stack>
      </Stack>
    );
  }

  return (
    <Stack spacing="gap-y-4">
      {activeModerators.map((moderator, idx) => (
        <React.Fragment key={moderator.name}>
          <Stack justify="between">
            <Stack spacing="gap-x-2" align="center">
              <Avatar avatar={moderator.avatar} />

              <Stack>
                <Text variant="button-md" weight="bold" truncate={true}>{`${moderator.name}`}</Text>

                <Text
                  variant="footnotes2"
                  weight="normal"
                  truncate={true}
                  color={{ light: 'grey4', dark: 'grey7' }}
                >{`@${moderator.did.id}`}</Text>
              </Stack>
            </Stack>

            <Button label={assignButtonLabel} onClick={onClickAssign} />
          </Stack>

          {idx < activeModerators.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
};

export default ModeratorListItem;
