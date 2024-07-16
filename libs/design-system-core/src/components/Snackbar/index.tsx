import React from 'react';
import { NotificationTypes } from '@akashaorg/typings/lib/ui';
import Button from '../Button';
import Card from '../Card';
import Icon from '../Icon';
import { InformationCircleIcon, XMarkIcon } from '../Icon/hero-icons-outline';
import Stack from '../Stack';
import Text from '../Text';
import { Color } from '../types/common.types';
import { getColorLight, getColorDark } from './getColor';

export type SnackbarProps = {
  title: React.ReactNode;
  type?: NotificationTypes;
  icon?: React.ReactElement;
  description?: string;
  ctaLabel?: string;
  customStyle?: string;
  accentColor?: boolean;
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
 * @param icon - (optional) if you want to include an icon to be displayed instead of the default one
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
  icon = <InformationCircleIcon />,
  description,
  ctaLabel,
  accentColor = false,
  dismissable = true,
  customStyle = '',
  handleCTAClick,
  handleDismiss,
}) => {
  const colorLight = getColorLight(type);
  const colorDark = getColorDark(type);

  const textColor: Color = { dark: 'white', light: 'black' };

  const instanceStyle = `p-4 border(l-8 solid ${colorLight}/30 dark:${colorDark}/30)`;

  return (
    <Card
      radius={8}
      background={{ light: 'white', dark: 'grey1' }}
      customStyle={`${instanceStyle} ${customStyle}`}
    >
      <Stack spacing="gap-x-3" fullWidth direction="row">
        <Icon icon={icon} color={{ light: colorLight, dark: colorDark }} size="lg" />
        <Stack direction="column">
          <Text variant="button-md" color={textColor}>
            {title}
          </Text>
          {description && (
            <Text variant="body2" color={textColor}>
              {description}
            </Text>
          )}
          {ctaLabel && (
            <Button onClick={handleCTAClick} plain>
              <Text
                variant="button-md"
                color={{
                  light: `${accentColor ? 'secondaryLight' : colorLight}`,
                  dark: `${accentColor ? 'secondaryDark' : colorDark}`,
                }}
              >
                {ctaLabel}
              </Text>
            </Button>
          )}
        </Stack>
        {dismissable && (
          <Button
            onClick={handleDismiss}
            customStyle="self-start	ml-auto"
            aria-label="dismiss"
            plain={true}
          >
            <Icon icon={<XMarkIcon />} color="grey7" size="lg" />
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default Snackbar;
