import React, { ReactNode } from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { ChatBubbleLeftRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type CardActionProps = {
  itemId: string;
  reflectAnchorLink?: string;
  disableActions?: boolean;
  actionsRight?: ReactNode;
  reflectionsCount?: number;
  onReflect: () => void;
  customStyle?: string;
};

const CardActions: React.FC<CardActionProps> = props => {
  const {
    itemId,
    reflectAnchorLink,
    disableActions,
    actionsRight,
    reflectionsCount,
    onReflect,
    customStyle = '',
  } = props;
  const reflectIconUi = <Icon icon={<ChatBubbleLeftRightIcon />} accentColor={true} />;
  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-2" customStyle={customStyle}>
      <>{actionsRight}</>
      <Link
        to={`${reflectAnchorLink}/${itemId}`}
        onClick={() => {
          if (!disableActions) onReflect();
        }}
        customStyle="h-fit"
      >
        {reflectionsCount ? (
          <Stack dataTestId="reflections-count" direction="row" align="end" spacing="gap-x-1">
            {reflectIconUi}
            <Text
              variant="body2"
              weight="normal"
              color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
            >
              {reflectionsCount}
            </Text>
          </Stack>
        ) : (
          reflectIconUi
        )}
      </Link>
    </Stack>
  );
};

export default CardActions;
