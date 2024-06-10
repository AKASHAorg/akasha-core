import React from 'react';

import Button from '../Button';
import Card from '../Card';
import Icon from '../Icon';
import { XMarkIcon } from '../Icon/hero-icons-outline';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';

import { Color, Elevation } from '../types/common.types';
import { getColorClasses } from '../../utils';

export type MessageCardProps = {
  title: string;
  message: string;
  titleVariant?: TextProps['variant'];
  titleIcon?: React.ReactElement;
  background?: Color;
  elevation?: Elevation;
  borderColor?: Color;
  dataTestId?: string;
  customStyle?: string;
  onClose: () => void;
};

/**
 * A MessageCard component is useful for displaying simple notifications in your app. The user
 * can opt to close it by clicking on the close icon.
 * @param title - string
 * @param message - string
 * @param titleVariant - (optional) customize the text variant for the title
 * @param titleIcon - (optional) include an icon for the title if you want
 * @param background - (optional) customize the background color
 * @param elevation - (optional) customize the elevation property of the card
 * @param borderColor - (optional) customize the border color
 * @param dataTestId - (optional) useful when writing test
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @param onClose - (optional) handler when clicking the close icon
 * @example
 * ```tsx
 *     <MessageCard title='Title' elevation='1' message='A sample message...' />
 * ```
 **/
const MessageCard: React.FC<MessageCardProps> = ({
  title,
  titleVariant = 'button-sm',
  titleIcon,
  background = 'white',
  elevation = 'none',
  borderColor,
  dataTestId,
  customStyle = '',
  message,
  onClose,
}) => {
  const borderStyle = borderColor ? `border ${getColorClasses(borderColor, 'border')}` : '';

  return (
    <Card
      elevation={elevation}
      background={background}
      radius={20}
      padding={'p-4'}
      dataTestId={dataTestId}
      customStyle={`${borderStyle} ${customStyle}`}
    >
      <Stack direction="column" spacing="gap-y-2">
        <Stack direction="row" justify="between">
          <Stack align="center" justify="center" spacing="gap-x-1" fullWidth>
            {titleIcon && <Icon icon={titleIcon} size="sm" />}
            <Text variant={titleVariant} align="center">
              {title}
            </Text>
          </Stack>

          <Button onClick={onClose} plain aria-label="close">
            <Icon icon={<XMarkIcon />} size="sm" />
          </Button>
        </Stack>
        <Text variant="footnotes2" weight="normal">
          {message}
        </Text>
      </Stack>
    </Card>
  );
};

export default MessageCard;
