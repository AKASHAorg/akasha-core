import Avatar from '@akashaorg/design-system-core/lib/components/Avatar';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import DidField from '@akashaorg/design-system-core/lib/components/DidField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Tooltip from '@akashaorg/design-system-core/lib/components/Tooltip';
import { transformSource } from '@akashaorg/ui-awf-hooks';
import React from 'react';

export type DashboardItemRendererProps = {
  itemType: 'Profile' | 'Beam' | 'Reply';
  viewProfileLabel: string;
};

const DashboardItemRenderer: React.FC<DashboardItemRendererProps> = props => {
  const { viewProfileLabel } = props;

  const avatar = {
    default: {
      height: 320,
      src: '',
      width: 320,
    },
    alternatives: [],
  };

  const textStyle = 'max-w([12.5rem] md:[7.5rem]) w-fit cursor-default';

  return (
    <Card>
      <Stack direction="row" align="center" justify="between">
        <Stack direction="row" spacing="gap-x-2" align="center">
          <Avatar
            size="md"
            avatar={transformSource(avatar?.default)}
            alternativeAvatars={avatar?.alternatives?.map(alternative =>
              transformSource(alternative),
            )}
          />
          <Stack>
            <Tooltip content="Golden Showers" placement="right">
              <Text variant="body2" weight="bold" customStyle={textStyle}>
                Golden Showers
              </Text>
            </Tooltip>

            <DidField did="somerandomdid" />
          </Stack>
        </Stack>

        <Button plain={true}>
          <Text variant="button-md" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {viewProfileLabel}
          </Text>
        </Button>
      </Stack>
    </Card>
  );
};

export default DashboardItemRenderer;
