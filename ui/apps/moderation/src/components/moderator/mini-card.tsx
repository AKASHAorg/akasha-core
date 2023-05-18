import React from 'react';

import { Moderator } from '@akashaorg/typings/ui';

import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';

import { formatDate } from '../../utils';

export interface IModeratorDetailMiniCardProps {
  moderator: Moderator;
  hasBorderBottom: boolean;
  tenureInfoLabel: string;
  onCardClick: (pubKey: string) => void;
}

const ModeratorDetailMiniCard: React.FC<IModeratorDetailMiniCardProps> = props => {
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
    <Box customStyle={`flex py-4 flex-none ${borderBottomStyle}`}>
      <Box customStyle="flex space-x-2 items-start w([50%] md:[30%]) px-4 border(r-1 solid grey8 dark:grey3)">
        <Avatar src={moderator.avatar} />

        <Box>
          <Tooltip content={moderator.name} placement="right">
            <Text variant="body2" weight="bold" truncate={true} customStyle={textStyle}>
              {moderator.name}
            </Text>
          </Tooltip>

          <Tooltip content={`@${moderator.userName}`} placement="right">
            <Text
              variant="button-md"
              weight="normal"
              truncate={true}
              customStyle={textStyle}
              color={{ light: 'grey4', dark: 'grey7' }}
            >
              @{moderator.userName}
            </Text>
          </Tooltip>

          <Box customStyle="flex space-x-1.5 items-center">
            <Box customStyle={`w-1.5 h-1.5 rounded-full ${moderatorStatusIndicator}`} />
            <Text variant="button-md" weight="normal" customStyle="capitalize">
              {moderator.status}
            </Text>
          </Box>
        </Box>
      </Box>

      <Box customStyle="flex w([50%] md:[70%]) px-4 justify-between items-center">
        <Box>
          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {tenureInfoLabel}:
          </Text>

          <Text variant="button-md" weight="normal" color={{ light: 'grey4', dark: 'grey6' }}>
            {moderator.status === 'active'
              ? formatDate(new Date(moderator.creationDate))
              : formatDate(moderator.moderatorEndDate)}
          </Text>
        </Box>

        <Button plain={true} onClick={() => onCardClick(moderator.pubKey)}>
          <Icon type="ChevronRightIcon" accentColor={true} customStyle="justify-end" />
        </Button>
      </Box>
    </Box>
  );
};

export default ModeratorDetailMiniCard;
