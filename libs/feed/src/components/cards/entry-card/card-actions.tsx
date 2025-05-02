import React, { ReactNode, useState } from 'react';
import Link from '@akashaorg/design-system-core/lib/components/Link';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { MessageCircleIcon } from 'lucide-react';

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
      <MessageCircleIcon
        className={`h-5 w-5 ${hovered ? '[&>*]:fill-secondaryLight dark:[&>*]:fill-secondaryDark' : '[&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark'}`}
      />
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
            <Text
              variant="body2"
              weight="normal"
              color={{
                light: 'secondaryLight',
                dark: 'secondaryDark',
              }}
              {...(disableActions && { customStyle: 'opacity-50' })}
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
