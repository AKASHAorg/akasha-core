import React from 'react';

import Button from '../Button';
import Card from '../Card';
import Icon, { IconProps } from '../Icon';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';

import { Color, Elevation } from '../types/common.types';
import { getColorClasses } from '../../utils';

export type MessageCardProps = {
  title: string;
  message: string;
  titleVariant?: TextProps['variant'];
  titleIconType?: IconProps['type'];
  background?: Color;
  elevation?: Elevation;
  borderColor?: Color;
  testId?: string;
  customStyle?: string;
  onClose: () => void;
};

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  titleVariant = 'button-sm',
  titleIconType,
  background = 'white',
  elevation = 'none',
  borderColor,
  testId,
  customStyle,
  message,
  onClose,
}) => {
  const borderStyle = borderColor ? `border ${getColorClasses(borderColor, 'border')}` : '';

  return (
    <Card
      elevation={elevation}
      background={background}
      radius={20}
      padding={16}
      testId={testId}
      customStyle={`${borderStyle} ${customStyle}`}
    >
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between">
          <Stack align="center" justify="center" spacing="gap-x-1" fullWidth>
            {titleIconType && <Icon type={titleIconType} size="sm" />}
            <Text variant={titleVariant} align="center">
              {title}
            </Text>
          </Stack>

          <Button onClick={onClose} plain aria-label="close">
            <Icon type="XMarkIcon" size="sm" />
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
