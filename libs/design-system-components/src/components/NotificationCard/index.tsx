import * as React from 'react';

import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { InboxNotification } from '@akashaorg/typings/lib/ui';

export interface NotificationCardEventProps {
  onClick?: (notification: InboxNotification) => void;
}

export type NotificationCardProps = NotificationCardEventProps & InboxNotification;

const NotificationCard: React.FC<NotificationCardProps> = props => {
  const {
    notificationTypeIcon,
    notificationTypeTitle,
    isSeen,
    notificationAppIcon,
    title,
    body,
    date,
    ctaLinkUrl,
    ctaLinkTitle,
    onClick,
  } = props;

  return (
    <Stack spacing={2} className="flex flex-col w-full">
      {/* Notification type & Is notification 'seen' dot indicator */}
      <Stack className="flex flex-row items-center justify-between w-full">
        <Stack spacing={2} className="flex flex-row">
          <Icon
            size="sm"
            icon={notificationTypeIcon}
            color={{ dark: 'grey6', light: 'black' }}
            customStyle="space-x-1"
          />
          <Text variant="footnotes1" color={{ dark: 'grey6', light: 'grey4' }} weight="bold">
            {notificationTypeTitle}
          </Text>
        </Stack>
        {!isSeen && (
          <Stack className="w-2 h-2 rounded-full bg(secondaryLight dark:secondaryDark)" />
        )}
      </Stack>
      <Stack spacing={2} className="flex flex-row">
        {notificationAppIcon}
        {/* Title and body */}
        <Stack spacing={2} className="flex flex-column">
          <Text variant="h6" breakWord={true}>
            {title}
          </Text>
          <Text
            variant="subtitle2"
            breakWord={true}
            weight="normal"
            color={{ dark: 'white', light: 'black' }}
          >
            {body}
          </Text>
        </Stack>
      </Stack>

      {/* Date and Button Section */}
      <Stack className="flex flex-row justify-between items-center ml-10">
        <Text variant="footnotes2" color={{ dark: 'grey6', light: 'grey4' }}>
          {date}
        </Text>
        {ctaLinkUrl && (
          <button onClick={() => onClick(props)}>
            <Stack>
              <Text
                variant="footnotes2"
                weight="bold"
                align="center"
                color={{ dark: 'secondaryDark', light: 'secondaryLight' }}
              >
                {ctaLinkTitle}
              </Text>
            </Stack>
          </button>
        )}
      </Stack>
    </Stack>
  );
};

export default NotificationCard;
