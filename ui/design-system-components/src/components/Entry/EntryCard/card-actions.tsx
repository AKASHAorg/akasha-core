import React, { ReactNode } from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { ChatBubbleLeftRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type CardActionProps = {
  itemId: string;
  repliesAnchorLink?: string;
  disableActions?: boolean;
  actionsRight?: ReactNode;
  onReflect: () => void;
};

const CardActions: React.FC<CardActionProps> = props => {
  const { itemId, repliesAnchorLink, disableActions, actionsRight, onReflect } = props;
  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-2">
      <>{actionsRight}</>
      <Anchor
        href={`${repliesAnchorLink}/${itemId}`}
        onClick={e => {
          e.preventDefault();
          if (!disableActions) onReflect();
        }}
        customStyle="h-fit"
      >
        <Icon icon={<ChatBubbleLeftRightIcon />} accentColor={true} />
      </Anchor>
    </Stack>
  );
};

export default CardActions;
