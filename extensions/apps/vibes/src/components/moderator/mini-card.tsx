import React from 'react';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate } from '@akashaorg/design-system-core/lib/utils';
import { getModeratorStatusIndicator } from '../../utils';
import { Moderator } from '@akashaorg/typings/lib/ui';
import { ChevronRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { transformSource } from '@akashaorg/ui-core-hooks';
import {
  ProfileAvatarButton,
  ProfileDidField,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar-button';
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
  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';
  return (
    <Stack padding="py-4" direction="row" customStyle={`flex-none ${borderBottomStyle}`}>
      <Stack
        direction="row"
        spacing="gap-x-2"
        align="start"
        padding="px-4"
        customStyle="w([50%] md:[45%])"
      >
        <Avatar
          avatar={transformSource(moderator?.avatar?.default)}
          alternativeAvatars={moderator?.avatar?.alternatives?.map(alternative =>
            transformSource(alternative),
          )}
        />
        <Stack>
          <Stack direction="row" align="center" spacing="gap-x-1">
            <Tooltip content={moderator.name} placement="right">
              <Typography variant="sm" bold className="truncate">
                {moderator.name}
              </Typography>
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

      <Stack
        direction="row"
        padding="px-4"
        justify="between"
        align="center"
        customStyle="w([50%] md:[55%])"
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

        <Button plain={true} onClick={() => onCardClick(moderator.did.id)}>
          <Icon icon={<ChevronRightIcon />} accentColor={true} customStyle="justify-end" />
        </Button>
      </Stack>
    </Stack>
  );
};
export default ModeratorDetailMiniCard;
