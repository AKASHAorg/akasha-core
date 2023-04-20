import React from 'react';

import { Moderator } from '@akashaorg/typings/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import { formatDate } from '../../utils/format-date';

export interface IModeratorDetailCardProps {
  moderator: Moderator;
  tenureInfoLabel: string;
  viewProfileLabel: string;
  dismissModeratorLabel: string;
  dismissModeratorDescLabel: string;
  onClickDismissModerator: () => void;
}

const ModeratorDetailCard: React.FC<IModeratorDetailCardProps> = props => {
  const {
    moderator,
    tenureInfoLabel,
    viewProfileLabel,
    dismissModeratorLabel,
    dismissModeratorDescLabel,
    onClickDismissModerator,
  } = props;

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  const boxStyle = 'flex justify-between';

  const moderatorStatusIndicator = `${
    moderator.status === 'active'
      ? 'bg-success'
      : moderator.status === 'revoked'
      ? 'bg(errorLight dark:errorDark)'
      : 'bg(warningLight dark:warningDark)'
  }`;

  return (
    <BasicCardBox pad="p-4 space-y-4">
      <Box customStyle={boxStyle}>
        <Box customStyle="flex space-x-2 items-center w([50%] md:[30%])">
          <Avatar src={moderator.avatar} />
          <Box>
            <Tooltip content={`${moderator.name}`} placement="right">
              <Text
                variant="button-lg"
                weight="bold"
                truncate={true}
                customStyle={textStyle}
              >{`${moderator.name}`}</Text>
            </Tooltip>

            <Tooltip content={`@${moderator.userName}`} placement="right">
              <Text
                variant="button-md"
                weight="normal"
                truncate={true}
                customStyle={textStyle}
                color={{ light: 'grey4', dark: 'grey7' }}
              >{`@${moderator.userName}`}</Text>
            </Tooltip>
          </Box>
        </Box>

        <Box>
          <Box customStyle="flex space-x-1.5 items-center">
            <Box customStyle={`w-1.5 h-1.5 rounded-full ${moderatorStatusIndicator}`} />
            <Text variant="button-md" weight="normal" customStyle="capitalize">
              {moderator.status}
            </Text>
          </Box>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {tenureInfoLabel}:
          </Text>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {moderator.status === 'active'
              ? formatDate(new Date(moderator.creationDate).toISOString())
              : formatDate(moderator.moderatorEndDate)}
          </Text>
        </Box>
      </Box>

      <Divider />

      <Box customStyle={boxStyle}>
        <Button label={viewProfileLabel} />

        {moderator.social && (
          <Box customStyle="flex space-x-2">
            {moderator.social?.discord && (
              <AppIcon placeholderIconType="discord" accentColor={true} />
            )}

            {moderator.social?.email && (
              <AppIcon placeholderIconType="message" accentColor={true} />
            )}
          </Box>
        )}
      </Box>

      <Divider />

      <Box customStyle="flex flex-col">
        <Text variant="button-md" weight="bold">
          {dismissModeratorLabel}
        </Text>

        <Text variant="footnotes2">{dismissModeratorDescLabel}</Text>

        <Button
          label={dismissModeratorLabel}
          customStyle="self-end"
          onClick={onClickDismissModerator}
        />
      </Box>
    </BasicCardBox>
  );
};

export default ModeratorDetailCard;
