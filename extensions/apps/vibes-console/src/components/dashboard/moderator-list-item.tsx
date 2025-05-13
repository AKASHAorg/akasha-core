import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Profile } from '@akashaorg/typings/lib/ui';
import { transformSource } from '@akashaorg/ui-core-hooks';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
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
      <Stack direction="row" spacing="gap-x-2" align="center" customStyle="mb-24">
        <Avatar
          avatar={transformSource(selectedModerator?.avatar?.default)}
          alternativeAvatars={selectedModerator?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
        />

        <Stack>
          <Typography
            variant="sm"
            bold
            className="truncate"
          >{`${selectedModerator.name}`}</Typography>

          <ProfileAvatarButton profileDID={selectedModerator.did.id}>
            <ProfileDidField />
          </ProfileAvatarButton>
        </Stack>
      </Stack>
    );
  }
  return (
    <Stack spacing="gap-y-4">
      {activeModerators.map((moderator, idx) => (
        <React.Fragment key={moderator.name}>
          <Stack direction="row" align="center" justify="between">
            <Stack direction="row" spacing="gap-x-2" align="center">
              <Avatar
                avatar={transformSource(moderator?.avatar?.default)}
                alternativeAvatars={moderator?.avatar?.alternatives?.map(alternative =>
                  transformSource(alternative),
                )}
              />

              <Stack>
                <Typography
                  variant="sm"
                  bold
                  className="truncate"
                >{`${moderator.name}`}</Typography>

                <ProfileAvatarButton profileDID={moderator.did.id}>
                  <ProfileDidField />
                </ProfileAvatarButton>
              </Stack>
            </Stack>

            <Button onClick={onClickAssign}>{assignButtonLabel}</Button>
          </Stack>

          {idx < activeModerators.length - 1 && <Divider />}
        </React.Fragment>
      ))}
    </Stack>
  );
};
export default ModeratorListItem;
