import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { getModeratorStatusIndicator } from '../../utils';
import { Moderator } from '@akashaorg/typings/lib/ui';
import { ChevronRightIcon } from 'lucide-react';
import { transformSource } from '@akashaorg/ui-core-hooks';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
export type ModeratorDetailMiniCardProps = {
  moderator: Moderator;
  hasBorderBottom: boolean;
  tenureInfoLabel: string;
  moderatedItemsLabel: string;
  onCardClick: (profileId: string) => void;
};
const ModeratorDetailMiniCard: React.FC<ModeratorDetailMiniCardProps> = props => {
  const { moderator, hasBorderBottom, tenureInfoLabel, moderatedItemsLabel, onCardClick } = props;
  const borderBottomStyle = `${hasBorderBottom ? 'border-b-1 border-solid border-grey8 dark:border-grey3' : ''}`;
  return (
    <Stack direction="row" className={`py-4 flex-none ${borderBottomStyle}`}>
      <Stack direction="row" spacing={2} alignItems="start" className="px-4 w([50%] md:[45%])">
        <ProfileAvatar size="xl">
          <ProfileAvatarImage src={transformSource(moderator?.avatar?.default).src} />
          <ProfileAvatarFallback />
        </ProfileAvatar>
        <Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Tooltip content={moderator.name} placement="right">
              <Typography variant="sm" bold className="truncate">
                {moderator.name}
              </Typography>
            </Tooltip>
            <Stack
              className={`w-1.5 h-1.5 rounded-full ${getModeratorStatusIndicator(moderator.status)}`}
            />
          </Stack>

          <ProfileAvatarButton profileDID={moderator.did.id}>
            <ProfileDidField />
          </ProfileAvatarButton>
        </Stack>
      </Stack>

      <Stack
        direction="row"
        justifyContent="between"
        alignItems="center"
        className="px-4 w([50%] md:[55%])"
      >
        <Stack>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey7">
            {tenureInfoLabel}:
          </Typography>

          <Typography variant="xs" className="font-medium font-normal">
            {moderator.status === 'active'
              ? `${moderator.moderatedItems} ${moderatedItemsLabel}`
              : formatDate(moderator.moderatorEndDate.toISOString(), 'DD MMM YYYY')}
          </Typography>
        </Stack>

        <button onClick={() => onCardClick(moderator.did.id)}>
          <ChevronRightIcon className="h-5 w-5 justify-end [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
        </button>
      </Stack>
    </Stack>
  );
};
export default ModeratorDetailMiniCard;
