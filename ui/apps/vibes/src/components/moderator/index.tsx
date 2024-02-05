import React from 'react';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import { Moderator } from '@akashaorg/typings/lib/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { formatDate, getModeratorStatusIndicator } from '../../utils';
import { EnvelopeIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Discord } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';

export type ModeratorDetailCardProps = {
  moderator: Moderator;
  tenureInfoLabel: string;
  viewProfileLabel: string;
};

const ModeratorDetailCard: React.FC<ModeratorDetailCardProps> = props => {
  const { moderator, tenureInfoLabel, viewProfileLabel } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Card padding={16} customStyle="space-y-4">
      <Stack direction="row" justify="between">
        <Stack direction="row" spacing="gap-x-2" align="center" customStyle="w([50%] md:[30%])">
          <Avatar
            avatar={transformSource(moderator?.avatar?.default)}
            alternativeAvatars={moderator?.avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
          />
          <Stack>
            <Tooltip content={moderator.name} placement="right">
              <Text
                variant="button-lg"
                weight="bold"
                truncate={true}
                customStyle={textStyle}
              >{`${moderator.name}`}</Text>
            </Tooltip>

            <DidField did={moderator.did.id} />
          </Stack>
        </Stack>

        <Stack>
          <Stack direction="row" align="center" spacing="gap-x-1.5">
            <Stack
              customStyle={`w-1.5 h-1.5 rounded-full ${getModeratorStatusIndicator(
                moderator.status,
              )}`}
            />
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

      <Stack direction="row" justify="between">
        <Button label={viewProfileLabel} />

        {moderator.social && (
          <Stack direction="row" spacing="gap-x-2">
            {moderator.social?.discord && (
              <AppIcon placeholderIcon={<Discord />} solid={true} accentColor={true} />
            )}

            {moderator.social?.email && (
              <AppIcon placeholderIcon={<EnvelopeIcon />} accentColor={true} />
            )}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default ModeratorDetailCard;
