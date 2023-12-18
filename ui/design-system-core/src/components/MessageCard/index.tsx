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
  testId?: string;
  customStyle?: string;
  onClose: () => void;
};

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  titleVariant = 'button-sm',
  titleIcon,
  background = 'white',
  elevation = 'none',
  borderColor,
  testId,
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
      testId={testId}
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
