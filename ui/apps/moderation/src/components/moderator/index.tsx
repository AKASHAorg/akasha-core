import React from 'react';

import { Moderator } from '@akashaorg/typings/ui';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import { formatDate } from '../../utils';

export type ModeratorDetailCardProps = {
  moderator: Moderator;
  tenureInfoLabel: string;
  viewProfileLabel: string;
  dismissModeratorLabel: string;
  dismissModeratorDescLabel: string;
  onClickDismissModerator: () => void;
};

const ModeratorDetailCard: React.FC<ModeratorDetailCardProps> = props => {
  const {
    moderator,
    tenureInfoLabel,
    viewProfileLabel,
    dismissModeratorLabel,
    dismissModeratorDescLabel,
    onClickDismissModerator,
  } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  const moderatorStatusIndicator = `${
    moderator.status === 'active'
      ? 'bg-success'
      : moderator.status === 'revoked'
      ? 'bg(errorLight dark:errorDark)'
      : 'bg(warningLight dark:warningDark)'
  }`;

  return (
    <Card padding={16} customStyle="space-y-4">
      <Stack justify="between">
        <Stack customStyle="flex space-x-2 items-center w([50%] md:[30%])">
          <Avatar avatar={moderator.avatar} />
          <Stack>
            <Tooltip content={moderator.name} placement="right">
              <Text
                variant="button-lg"
                weight="bold"
                truncate={true}
                customStyle={textStyle}
              >{`${moderator.name}`}</Text>
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
          </Stack>
        </Stack>

        <Stack>
          <Stack align="center" spacing="gap-x-1.5">
            <Stack customStyle={`w-1.5 h-1.5 rounded-full ${moderatorStatusIndicator}`} />
            <Text variant="button-md" weight="normal" customStyle="capitalize">
              {moderator.status}
            </Text>
          </Stack>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {tenureInfoLabel}:
          </Text>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {moderator.status === 'active'
              ? formatDate(new Date(moderator.createdAt).toISOString())
              : formatDate(moderator.moderatorEndDate)}
          </Text>
        </Stack>
      </Stack>

      <Divider />

      <Stack justify="between">
        <Button label={viewProfileLabel} />

        {moderator.social && (
          <Stack spacing="gap-x-2">
            {moderator.social?.discord && (
              <AppIcon placeholderIconType="discord" accentColor={true} />
            )}

            {moderator.social?.email && (
              <AppIcon placeholderIconType="EnvelopeIcon" accentColor={true} />
            )}
          </Stack>
        )}
      </Stack>

      <Divider />

      <Stack>
        <Text variant="button-md" weight="bold">
          {dismissModeratorLabel}
        </Text>

        <Text variant="footnotes2">{dismissModeratorDescLabel}</Text>

        <Button
          label={dismissModeratorLabel}
          customStyle="self-end"
          onClick={onClickDismissModerator}
        />
      </Stack>
    </Card>
  );
};

export default ModeratorDetailCard;
