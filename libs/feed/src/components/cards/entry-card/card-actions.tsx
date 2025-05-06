import React, { ReactNode, useState } from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { ChatBubbleLeftRightIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { ChatBubbleLeftRightIcon as ChatBubbleLeftRightIconSolid } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-solid';
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
  const [hovered, setHovered] = useState(false);
  const reflectIconUi = (
    <Card
      onMouseEnter={() => {
        if (!disableActions) setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      className="p-0 border-none"
    >
      {hovered ? (
        <Icon
          icon={<ChatBubbleLeftRightIconSolid />}
          disabled={disableActions}
          accentColor={true}
          solid
        />
      ) : (
        <Icon icon={<ChatBubbleLeftRightIcon />} disabled={disableActions} accentColor={true} />
      )}
    </Card>
  );
  return (
    <Stack direction="row" align="center" justify="end" spacing="gap-x-2" customStyle={customStyle}>
      <>{actionsRight}</>
      <Link
        to={`${reflectAnchorLink}/${itemId}`}
        onClick={() => {
          if (!disableActions) onReflect();
        }}
        customStyle={`h-fit cursor-${disableActions ? 'not-allowed' : 'pointer'}`}
      >
        {reflectionsCount ? (
          <Stack dataTestId="reflections-count" direction="row" align="end" spacing="gap-x-1">
            {reflectIconUi}
            <Typography
              variant="sm"
              {...(disableActions && {
                customStyle: 'opacity-50',
              })}
              className="font-normal text-secondaryLight dark:text-secondaryDark"
            >
              {reflectionsCount}
            </Typography>
          </Stack>
        ) : (
          reflectIconUi
        )}
      </Link>
    </Stack>
  );
};
export default CardActions;
