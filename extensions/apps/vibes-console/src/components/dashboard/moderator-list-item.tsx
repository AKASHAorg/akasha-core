import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Profile } from '@akashaorg/typings/lib/ui';
import { transformSource } from '@akashaorg/ui-core-hooks';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import {
  ProfileAvatarFallback,
  ProfileAvatarImage,
  ProfileAvatar,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
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
      <Stack direction="row" spacing={2} alignItems="center" className="mb-24">
        <ProfileAvatar>
          <ProfileAvatarImage src={transformSource(selectedModerator?.avatar?.default).src} />
          <ProfileAvatarFallback />
        </ProfileAvatar>
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
    <Stack spacing={4}>
      {activeModerators.map((moderator, idx) => (
        <React.Fragment key={moderator.name}>
          <Stack direction="row" alignItems="center" justifyContent="between">
            <Stack direction="row" spacing={2} alignItems="center">
              <ProfileAvatar>
                <ProfileAvatarImage src={transformSource(moderator?.avatar?.default).src} />
                <ProfileAvatarFallback />
              </ProfileAvatar>

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

          {idx < activeModerators.length - 1 && <Separator />}
        </React.Fragment>
      ))}
    </Stack>
  );
};
export default ModeratorListItem;
