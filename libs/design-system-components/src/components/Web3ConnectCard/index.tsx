import React from 'react';
import AppIcon, { AppIconProps } from '@akashaorg/design-system-core/lib/components/AppIcon';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Color } from '@akashaorg/design-system-core/lib/components/types/common.types';
import { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';

export type TWeb3ConnectCardProps = {
  titleLabel: string;
  leftIconType: AppIconProps['placeholderIcon'];
  subtitleLabel?: string;
  iconSize: AppIconProps['size'];
  boxSize?: AppIconProps['backgroundSize'];
  iconColor?: IconProps['color'];
  boxBgColor?: Color;
  handleClick: () => void;
};

/**
 * Component used in the auth app to initiate the wallet connection
 * redirects the user to the next step of authenticating
 * @param boxSize - object with width and height of the app icon
 * @param iconSize - object with width and height of the app icon
 * @param handleClick -  handler to continue the authentication process
 */
const Web3ConnectCard: React.FC<TWeb3ConnectCardProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    leftIconType,
    iconSize = { width: 40, height: 40 },
    boxSize = { width: 40, height: 40 },
    boxBgColor = 'transparent',
    iconColor = 'self-color',
    handleClick,
  } = props;

  return (
    <Card
      elevation="none"
      radius={8}
      padding="p-2"
      accentBorder={true}
      customStyle="select-none hover:bg(secondaryLight/10 dark:secondaryDark/10)"
      onClick={handleClick}
      fullWidth
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
  );
};

export default Web3ConnectCard;
