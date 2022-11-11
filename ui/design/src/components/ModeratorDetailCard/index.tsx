import React from 'react';
import dayjs from 'dayjs';
import { Box, Text } from 'grommet';

import { IModeratorInfo } from '@akashaorg/typings/ui';

import SocialLink from './social-link';
import Avatar from '../Avatar';
import { useViewportSize } from '../Providers/viewport-dimension';

export interface IModeratorDetailCardProps {
  moderator: IModeratorInfo;
  hasBorderBottom: boolean;
  tenureInfoLabel: string;
  onSocialLinkClick: () => void;
}

const ModeratorDetailCard: React.FC<IModeratorDetailCardProps> = props => {
  const { moderator, hasBorderBottom, tenureInfoLabel, onSocialLinkClick } = props;

  const { size } = useViewportSize();

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM YYYY');
  };

  return (
    <Box
      direction="row"
      pad={{ vertical: 'medium' }}
      flex={false}
      border={hasBorderBottom ? { side: 'bottom', color: 'border' } : false}
    >
      <Box
        direction="row"
        width={size === 'small' ? '50%' : '38%'}
        align="center"
        gap="xsmall"
        pad={{ horizontal: 'medium' }}
        border={{ side: 'right', color: 'border' }}
      >
        <Avatar src={moderator.avatar} size={size === 'small' ? 'sm' : 'xxl'} />

        <Box gap="xxsmall">
          <Text size="large">{moderator.name}</Text>

          <Text size="medium" color="subtitleText">{`@${moderator.username}`}</Text>
        </Box>
      </Box>

      <Box
        direction="row"
        width={size === 'small' ? '50%' : '62%'}
        pad={{ horizontal: 'medium' }}
        justify="between"
        align="center"
      >
        <Box gap="medium">
          <Box>
            <Text size="medium" color="subtitleText">
              {tenureInfoLabel}:
            </Text>

            <Text size="medium" color="subtitleText">
              {moderator.status === 'active'
                ? formatDate(moderator.moderatorStartDate)
                : formatDate(moderator.moderatorEndDate)}
            </Text>
          </Box>

          <Box direction="row" gap="xxsmall" align="center">
            <Box
              width="0.375rem"
              height="0.375rem"
              round={true}
              background={
                moderator.status === 'active'
                  ? 'green'
                  : moderator.status === 'revoked'
                  ? 'red'
                  : 'yellow'
              }
            />
            <Text style={{ textTransform: 'capitalize' }}>{moderator.status}</Text>
          </Box>
        </Box>

        {moderator.status === 'active' && (moderator.social.discord || moderator.social.email) && (
          <Box direction="row" gap="small">
            {moderator.social.discord && (
              <SocialLink
                iconType="discord"
                iconSize={size === 'small' ? 'sm' : 'md'}
                onClick={onSocialLinkClick}
              />
            )}

            {moderator.social.email && (
              <SocialLink
                iconType="emailAlt"
                iconSize={size === 'small' ? 'sm' : 'md'}
                onClick={onSocialLinkClick}
              />
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ModeratorDetailCard;
