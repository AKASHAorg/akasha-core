import React, { ReactNode } from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
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
};

const CardActions: React.FC<CardActionProps> = props => {
  const { itemId, reflectAnchorLink, disableActions, actionsRight, reflectionsCount, onReflect } =
    props;
  const reflectIconUi = <Icon icon={<ChatBubbleLeftRightIcon />} accentColor={true} />;
  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-2">
      <>{actionsRight}</>
      <Anchor
        href={`${reflectAnchorLink}/${itemId}`}
        onClick={e => {
          e.preventDefault();
          if (!disableActions) onReflect();
        }}
        customStyle="h-fit"
      >
        {reflectionsCount ? (
          <Stack direction="row" align="end" spacing="gap-x-1">
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
      </Anchor>
    </Stack>
  );
};

export default CardActions;
