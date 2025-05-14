import * as React from 'react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
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
          {notificationTypeIcon}
          <Typography variant="xs" bold className="text-grey4 dark:text-grey6">
            {notificationTypeTitle}
          </Typography>
        </Stack>
        {!isSeen && (
          <Stack className="w-2 h-2 rounded-full bg-secondaryLight dark:bg-secondaryDark" />
        )}
      </Stack>
      <Stack spacing={2} className="flex flex-row">
        {notificationAppIcon}
        {/* Title and body */}
        <Stack spacing={2} className="flex flex-column">
          <Typography variant="h6" className="break-all">
            {title}
          </Typography>
          <Typography
            variant="sm"
            className="font-light break-all font-normal text-black dark:text-white"
          >
            {body}
          </Typography>
        </Stack>
      </Stack>

      {/* Date and Button Section */}
      <Stack className="flex flex-row justify-between items-center ml-10">
        <Typography variant="xs" className="font-medium text-grey4 dark:text-grey6">
          {date}
        </Typography>
        {ctaLinkUrl && (
          <button onClick={() => onClick(props)}>
            <Stack>
              <Typography
                variant="xs"
                bold
                className="font-medium text-center text-secondaryLight dark:text-secondaryDark"
              >
                {ctaLinkTitle}
              </Typography>
            </Stack>
          </button>
        )}
      </Stack>
    </Stack>
  );
};
export default NotificationCard;
