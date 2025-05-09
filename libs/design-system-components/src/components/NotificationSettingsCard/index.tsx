import React from 'react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Image } from '@akashaorg/ui/lib/akasha-components/image';
const IMAGES = {
  notificationsDefault: '/images/notificationapp-welcome-min.webp',
  browserDefault: '/images/notification-browser.webp',
  browserEnabled: '/images/notification-browser-enabled.webp',
  browserDisabled: '/images/notification-browser-disabled.webp',
  noNotifications: '/images/notificationapp-welcome-min.webp',
};
export type NotificationsImageSrc = keyof typeof IMAGES;
export type NotificationSettingsCardProps = {
  // data
  title: string;
  text: string;
  image?: NotificationsImageSrc;
  isLoading?: boolean;
  showButton?: boolean;
  buttonLabel?: string;
  noWrapperCard?: boolean;
  // handlers
  handleButtonClick: () => void;
};
const NotificationSettingsCard: React.FC<NotificationSettingsCardProps> = ({
  title,
  text,
  image = IMAGES.notificationsDefault,
  isLoading,
  buttonLabel,
  noWrapperCard,
  showButton = true,
  handleButtonClick,
}) => {
  const content = (
    <Stack alignItems="center" className="p-5">
      <Image
        className="w-[180px] h-[180px] object-contain mb-4"
        src={IMAGES[image]}
        alt="Notification illustration"
      />
      <Typography variant="h5" className="mb-2 text-center">
        {title}
      </Typography>
      <Typography variant="sm" className="mb-4 text-center">
        {text}
      </Typography>

      {showButton && (
        <Button loading={isLoading} onClick={handleButtonClick} className="w-fit">
          {buttonLabel}
        </Button>
      )}
    </Stack>
  );
  return noWrapperCard ? content : <Card className="p-0 w-full grow flex-wrap">{content}</Card>;
};
export default NotificationSettingsCard;
