import React from 'react';
import { transformSource } from '@akashaorg/ui-core-hooks';
import { Moderator } from '@akashaorg/typings/lib/ui';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { getModeratorStatusIndicator } from '../../utils';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
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
      <Stack direction="row" justify="between">
        <Stack direction="row" spacing="gap-x-2" align="center">
          <Avatar
            size="lg"
            avatar={transformSource(moderator?.avatar?.default)}
            alternativeAvatars={moderator?.avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
          />
          <Stack>
            <Stack direction="row" align="center" spacing="gap-x-1">
              <Tooltip content={moderator.name} placement="right">
                <Typography variant="sm" bold>{`${moderator.name}`}</Typography>
              </Tooltip>
              <Stack
                customStyle={`w-1.5 h-1.5 rounded-full ${getModeratorStatusIndicator(moderator.status)}`}
              />
            </Stack>

            <ProfileAvatarButton profileDID={moderator.did.id}>
              <ProfileDidField />
            </ProfileAvatarButton>
          </Stack>
        </Stack>

        <Button>{viewProfileLabel}</Button>
      </Stack>

      <Divider />

      <Stack direction="row" justify="between">
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
