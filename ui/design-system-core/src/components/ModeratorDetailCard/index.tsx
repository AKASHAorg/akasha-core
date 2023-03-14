import React from 'react';
import dayjs from 'dayjs';
import { apply, tw } from '@twind/core';

import { Moderator } from '@akashaorg/typings/ui';

import SocialLink from './social-link';
import Avatar from '../Avatar';
import Text from '../Text';
import Tooltip from '../Tooltip';

export interface IModeratorDetailCardProps {
  moderator: Moderator;
  hasBorderBottom: boolean;
  tenureInfoLabel: string;
  onSocialLinkClick: () => void;
}

const ModeratorDetailCard: React.FC<IModeratorDetailCardProps> = props => {
  const { moderator, hasBorderBottom, tenureInfoLabel, onSocialLinkClick } = props;

  const formatDate = (date: string) => {
    return dayjs(date).format('MMM YYYY');
  };

  const borderBottomStyle = apply`${hasBorderBottom ? 'border(b-1 solid grey8 dark:grey3)' : ''}`;

  const truncateStyle = tw(
    'max-w([12.5rem] md:[7.5rem]) w-fit whitespace-nowrap overflow-hidden text-ellipsis cursor-default',
  );

  const moderatorStatusIndicator = apply`${
    moderator.status === 'active'
      ? 'bg-success'
      : moderator.status === 'revoked'
      ? 'bg(error-light dark:error-dark)'
      : 'bg(warning-light dark:warning-dark)'
  }`;

  return (
    <div className={tw(`flex py-4 flex-none ${borderBottomStyle}`)}>
      <div
        className={tw(
          'flex space-x-2 items-start w([50%] md:[30%]) px-4 border(r-1 solid grey8 dark:grey3)',
        )}
      >
        <Avatar src={moderator.avatar} />
        <div>
          <Tooltip content={`${moderator.name}`} placement="right">
            <Text
              variant="body2"
              weight="bold"
              customStyle={truncateStyle}
            >{`${moderator.name}`}</Text>
          </Tooltip>

          <Tooltip content={`@${moderator.userName}`} placement="right">
            <Text
              variant="button-md"
              weight="normal"
              customStyle={truncateStyle}
              color={{ light: 'text-grey4', dark: 'text-grey7' }}
            >{`@${moderator.userName}`}</Text>
          </Tooltip>
          <div className={tw('flex space-x-1.5 items-center')}>
            <div className={tw(`w-1.5 h-1.5 rounded-full ${moderatorStatusIndicator}`)} />
            <Text variant="button-md" weight="normal" customStyle={tw('capitalize')}>
              {moderator.status}
            </Text>
          </div>
        </div>
      </div>

      <div className={tw('flex w([50%] md:[62%]) px-4 justify-between items-center')}>
        <div>
          <div>
            <Text
              variant="button-md"
              weight="normal"
              color={{ light: 'text-grey4', dark: 'text-grey6' }}
            >
              {tenureInfoLabel}:
            </Text>

            <Text
              variant="button-md"
              weight="normal"
              color={{ light: 'text-grey4', dark: 'text-grey6' }}
            >
              {moderator.status === 'active'
                ? formatDate(new Date(moderator.creationDate).toISOString())
                : formatDate(moderator.moderatorEndDate)}
            </Text>
          </div>
        </div>

        {moderator.status === 'active' && (moderator.social?.discord || moderator.social?.email) && (
          <div className={tw('flex')}>
            {moderator.social?.discord && (
              <SocialLink iconType="discord" onClick={onSocialLinkClick} />
            )}

            {moderator.social?.email && (
              <SocialLink iconType="akasha" onClick={onSocialLinkClick} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorDetailCard;
