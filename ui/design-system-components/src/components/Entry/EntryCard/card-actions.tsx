import * as React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type CardActionProps = {
  profileId: string;
  repliesAnchorLink?: string;
  disableActions?: boolean;
  isModerated?: boolean;
  actionsRightExt?: React.ReactNode;
  onReflect: () => void;
};

const CardActions: React.FC<CardActionProps> = props => {
  const { profileId, repliesAnchorLink, disableActions, isModerated, actionsRightExt, onReflect } =
    props;

  if (isModerated) {
    return (
      <Stack
        direction="row"
        justify="end"
        align="center"
        spacing="gap-x-4"
        customStyle="w-3/4 self-center py-4"
      >
        <Button onClick={onReflect} plain>
          <Icon type="ChatBubbleLeftRightIcon" accentColor={true} />
        </Button>
      </Stack>
    );
  }

  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-4" customStyle="p-4">
      <>{actionsRightExt}</>
      <Anchor
        href={`${repliesAnchorLink}/${profileId}`}
        customStyle="no-underline"
        onClick={e => {
          e.preventDefault();
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
