import * as React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type CardActionProps = {
  itemId: string;
  repliesAnchorLink?: string;
  disableActions?: boolean;
  actionsRightExt?: React.ReactNode;
  onReflect: () => void;
};

const CardActions: React.FC<CardActionProps> = props => {
  const { itemId, repliesAnchorLink, disableActions, actionsRightExt, onReflect } = props;

  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-4">
      <>{actionsRightExt}</>
      <Anchor
        href={`${repliesAnchorLink}/${itemId}`}
        customStyle="no-underline"
        onClick={e => {
          e.preventDefault();
          //@TODO: refactor the onReflect prop
          if (!disableActions) onReflect();
        }}
      >
        <Stack direction="row" align="center" spacing="gap-x-2">
          <Icon type="ChatBubbleLeftRightIcon" accentColor={true} />
        </Stack>
      </Anchor>
    </Stack>
  );
};

export default CardActions;
