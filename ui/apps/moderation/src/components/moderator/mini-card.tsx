import React from 'react';

import { Moderator } from '@akashaorg/typings/lib/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import { formatDate } from '../../utils';

export type ModeratorDetailMiniCardProps = {
  moderator: Moderator;
  hasBorderBottom: boolean;
  tenureInfoLabel: string;
  onCardClick: (profileId: string) => void;
};

const ModeratorDetailMiniCard: React.FC<ModeratorDetailMiniCardProps> = props => {
  const { moderator, hasBorderBottom, tenureInfoLabel, onCardClick } = props;

  const borderBottomStyle = `${hasBorderBottom ? 'border(b-1 solid grey8 dark:grey3)' : ''}`;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  const moderatorStatusIndicator = `${
    moderator.status === 'active'
      ? 'bg-success'
      : moderator.status === 'revoked'
      ? 'bg-(errorLight dark:errorDark)'
      : 'bg-(warningLight dark:warningDark)'
  }`;

  return (
    <Stack customStyle={`py-4 flex-none ${borderBottomStyle}`}>
      <Stack
        spacing="gap-x-2"
        align="start"
        customStyle=" w([50%] md:[30%]) px-4 border(r-1 solid grey8 dark:grey3)"
      >
        <Avatar avatar={moderator.avatar} />
        <Stack>
          <Tooltip content={moderator.name} placement="right">
            <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
              {moderator.name}
            </Text>
          </Tooltip>

          <Tooltip content={`${moderator.name}`} placement="right">
            <Text
              variant="button-md"
              weight="normal"
              truncate={true}
              customStyle={textStyle}
              color={{ light: 'grey4', dark: 'grey7' }}
            >{`${moderator.name}`}</Text>
          </Tooltip>

          <Stack align="center" spacing="gap-x-1.5">
            <Stack customStyle={`w-1.5 h-1.5 rounded-full ${moderatorStatusIndicator}`} />
            <Text variant="button-md" weight="normal" customStyle="capitalize">
              {moderator.status}
            </Text>
          </Stack>
        </Stack>
      </Stack>

      <Stack justify="between" align="center" customStyle="w([50%] md:[70%]) px-4">
        <Stack>
          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {tenureInfoLabel}:
          </Text>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {moderator.status === 'active'
              ? formatDate(new Date(moderator.createdAt))
              : formatDate(moderator.moderatorEndDate)}
          </Text>
        </Stack>

        <Button plain={true} onClick={() => onCardClick(moderator.did.id)}>
          <Icon type="ChevronRightIcon" accentColor={true} customStyle="justify-end" />
        </Button>
      </Stack>
    </Stack>
  );
};

export default ModeratorDetailMiniCard;
