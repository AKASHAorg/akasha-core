import React from 'react';
import Card from '../Card';
import Text, { TextProps } from '../Text';
import Stack from '../Stack';
import Icon from '../Icon';
import Button from '../Button';
import { Color, Elevation } from '../types/common.types';

type MessageCardProps = {
  title: string;
  message: string;
  titleVariant?: TextProps['variant'];
  background?: Color;
  elevation?: Elevation;
  onClose: () => void;
};

const MessageCard: React.FC<MessageCardProps> = ({
  title,
  titleVariant = 'button-sm',
  message,
  background = 'white',
  elevation = 'none',
  onClose,
}) => {
  return (
    <Card elevation={elevation} background={background} radius={20} padding={16}>
      <Stack direction="column" spacing="gap-y-2">
        <Stack justify="between">
          <Text variant={titleVariant} align="center" customStyle="grow">
            {title}
          </Text>
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
