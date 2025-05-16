import React from 'react';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';

import { CheckCircleIcon, TriangleAlertIcon, InfoIcon, XCircleIcon, XIcon } from 'lucide-react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export type SnackbarProps = {
  title: React.ReactNode;
  type?: NotificationTypes;
  description?: string;
  ctaLabel?: string;
  customStyle?: string;
  dismissable?: boolean;
  handleCTAClick?: (event: React.SyntheticEvent<Element, Event>) => void;
  handleDismiss?: (event: React.SyntheticEvent<Element, Event>) => void;
};

/**
 * The Snackbar component is an UI element that is often used to display brief messages that don't
 * requires immediate actions from the user. One example is to provide feedback or updates when a user
 * perform an action. The Snackbar will appear near the bottom of the page and will disappear after
 * a predetermined amount of time.
 * @param title -  title of the snackbar
 * @param type - (optional) type of the snackbar. Please import `NotificationTypes` from the
 * typings package to explore all available Snackbar types
 * @param description - (optional)  more details regarding the notification
 * @param ctaLabel - (optional)  add a label if you want to show a button and allow the user
 * to perform some action
 * @param dismissable - (optional) defaults to true. Determines if the user should be able to dismiss the snackbar
 * @param handleCTAClick - (optional) click handler to be included if an `ctaLabel` prop is provided
 * @param handleDismiss - (optional) handler that will be called when the user click the close button
 * @param customStyle - (optional)  add custom Tailwind CSS classes here
 * @example
 * ```tsx
 *   <Snackbar title='Snackbar' description='Some important information will appear here' />
 * ```
 **/
const Snackbar: React.FC<SnackbarProps> = ({
  title,
  type = NotificationTypes.Info,
  description,
  ctaLabel,
  dismissable = true,
  customStyle = '',
  handleCTAClick,
  handleDismiss,
}) => {
  const textColor = 'text-dark dark:text-white';

  const instanceStyle = `p-4 border-l-8 border-solid ${borderColorMap[type]}  shadow-[0_0_4px_rgba(0,0,0,0.2)] dark:shadow-[0_0_2px_rgba(255,255,255,0.15)]`;

  const typeIconsMap: Record<NotificationTypes, React.ReactElement> = {
    info: (
      <InfoIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    ),
    caution: (
      <TriangleAlertIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    ),
    success: (
      <CheckCircleIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    ),
    error: (
      <XCircleIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    ),
  };

  return (
    <Card className={`${instanceStyle} ${customStyle} bg-white dark:bg-grey1 rounded-[8px]`}>
      <Stack spacing={3} direction="row" className="w-full">
        {typeIconsMap[type]}
        <Stack direction="column">
          <Typography variant="sm" bold className={textColor}>
            {title}
          </Typography>
          {description && (
            <Typography variant="sm" className={textColor}>
              {description}
            </Typography>
          )}
          {ctaLabel && (
            <button onClick={handleCTAClick}>
              <Typography variant="sm" className="text-secondaryLight dark:text-secondaryDark">
                {ctaLabel}
              </Typography>
            </button>
          )}
        </Stack>
        {dismissable && (
          <button onClick={handleDismiss} className="self-start	ml-auto" aria-label="dismiss">
            <XIcon className="h-6 w-6 [&>*]:stroke-grey7" />
          </button>
        )}
      </Stack>
    </Card>
  );
};

const borderColorMap: Record<NotificationTypes, string> = {
  [NotificationTypes.Error]: 'border-errorLight dark:border-errorDark',
  [NotificationTypes.Caution]: 'border-warningLight dark:border-warningDark',
  [NotificationTypes.Success]: 'border-success',
  [NotificationTypes.Info]: 'border-secondaryLight dark:border-secondaryDark',
};

export default Snackbar;
