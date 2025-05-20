import React from 'react';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { Moderator } from '@akashaorg/typings/lib/ui';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { getModeratorStatusIndicator } from '../../utils';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import {
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { ProfileAvatar } from '@akashaorg/ui/lib/akasha-components/profile-avatar';
export type ModeratorDetailCardProps = {
  moderator: Moderator;
  tenureInfoLabel: string;
  moderatedLabel: string;
  moderatedItemsLabel: string;
  viewProfileLabel: string;
};
const ModeratorDetailCard: React.FC<ModeratorDetailCardProps> = props => {
  const { moderator, tenureInfoLabel, moderatedLabel, moderatedItemsLabel, viewProfileLabel } =
    props;
  return (
    <Card className="p-4 space-y-4">
      <Stack direction="row" justifyContent="between">
        <Stack direction="row" spacing={2} alignItems="center">
          <ProfileAvatar size="xl">
            <ProfileAvatarImage src={transformSource(moderator?.avatar?.default).src} />
            <ProfileAvatarFallback />
          </ProfileAvatar>

          <Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Tooltip content={moderator.name} placement="right">
                <Typography variant="sm" bold>{`${moderator.name}`}</Typography>
              </Tooltip>
              <Stack className="`w-1.5 h-1.5 rounded-full ${getModeratorStatusIndicator(moderator.status)" />
            </Stack>

            <ProfileAvatarButton profileDID={moderator.did.id}>
              <ProfileDidField />
            </ProfileAvatarButton>
          </Stack>
        </Stack>

        <Button>{viewProfileLabel}</Button>
      </Stack>

      <Separator />

      <Stack direction="row" justifyContent="between">
        <Stack>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey6">
            {tenureInfoLabel}:
          </Typography>

          <Typography variant="xs" className="font-medium font-normal">
            {moderator.status === 'active'
              ? formatDate(new Date(moderator.createdAt).toISOString(), 'DD MMM YYYY')
              : `${formatDate(moderator.createdAt.toISOString(), 'MMM YYYY')} - ${formatDate(moderator.moderatorEndDate.toISOString(), 'DD MMM YYYY')}`}
          </Typography>
        </Stack>

        <Stack>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey6">
            {moderatedLabel}:
          </Typography>

          <Typography variant="xs" className="font-medium font-normal">
            {`${moderator.moderatedItems} ${moderatedItemsLabel}`}
          </Typography>
        </Stack>
      </Stack>
    </Card>
  );
};
export default ModeratorDetailCard;
