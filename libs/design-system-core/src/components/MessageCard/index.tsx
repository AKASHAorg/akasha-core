import React from 'react';
import Stack from '../Stack';
import Text from '../Text';
import { Color } from '../types/common.types';

export type MessageCardProps = {
  message: string;
  icon?: React.ReactElement;
  background?: Color;
  dataTestId?: string;
  customStyle?: string;
};

/**
 * A MessageCard component is useful for displaying simple notifications in an app.
 * @param message - string
 * @param icon - (optional) include an icon
 * @param background - (optional) customize the background color
 * @param dataTestId - (optional) useful when writing test
 * @param customStyle - (optional) apply your custom styling (Make sure to use standard Tailwind classes)
 * @example
 * ```tsx
 *     <MessageCard message='A sample message...' />
 * ```
 **/
const MessageCard: React.FC<MessageCardProps> = ({
  message,
  icon,
  background,
  dataTestId,
  customStyle = '',
}) => {
  return (
    <Stack
      direction="row"
      spacing="gap-1"
      align="center"
      background={background}
      padding="p-2"
      dataTestId={dataTestId}
      customStyle={`rounded ${customStyle}`}
    >
      {icon}
      <Text variant="footnotes2" weight="normal">
        {message}
      </Text>
    </Stack>
  );
};

export default MessageCard;
