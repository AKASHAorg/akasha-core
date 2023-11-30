import React from 'react';
import { Color } from '@akashaorg/design-system-core/lib/components/types/common.types';
import AppIcon, { AppIconProps } from '@akashaorg/design-system-core/lib/components/AppIcon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type TWeb3ConnectCardProps = {
  titleLabel: string;
  leftIconType: AppIconProps['placeholderIcon'];
  subtitleLabel?: string;
  iconSize: AppIconProps['size'];
  boxSize: AppIconProps['backgroundSize'];
  iconColor?: IconProps['color'];
  boxBgColor?: Color;
  handleClick: () => void;
};

const Web3ConnectCard: React.FC<TWeb3ConnectCardProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    leftIconType,
    iconSize,
    boxSize,
    boxBgColor = 'white',
    iconColor,
    handleClick,
  } = props;

  return (
    <Button plain onClick={handleClick}>
      <Card
        elevation="none"
        radius={8}
        padding={'p-2'}
        accentBorder={true}
        customStyle="select-none w-full"
      >
        <Stack direction="row" align="center" spacing="gap-x-2">
          <AppIcon
            iconColor={iconColor}
            placeholderIcon={leftIconType}
            radius={8}
            size={iconSize}
            backgroundSize={boxSize}
            background={boxBgColor}
          />
          <Stack>
            <Text variant="h6">{titleLabel}</Text>
            {subtitleLabel && (
              <Text variant="footnotes2" color={{ light: 'grey4', dark: 'grey7' }}>
                {subtitleLabel}
              </Text>
            )}
          </Stack>
        </Stack>
      </Card>
    </Button>
  );
};

export default Web3ConnectCard;
