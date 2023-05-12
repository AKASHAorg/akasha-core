import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IHelloModeratorCardProps {
  titleLabel: string;
  subtitleLabel: string;
  moderatorGuideLabel: string;
  moderationFAQLabel: string;
  onClickButton: () => void;
}
const HelloModeratorCard: React.FC<IHelloModeratorCardProps> = props => {
  const { titleLabel, subtitleLabel, moderatorGuideLabel, moderationFAQLabel, onClickButton } =
    props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col items-center space-y-6">
        <Text variant="h6" weight="bold">
          {titleLabel}
        </Text>

        <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>

        <Box customStyle="flex space-x-6 justify-center">
          <Button plain={true} onClick={onClickButton}>
            <Box customStyle="flex items-center space-x-2">
              <Icon size="sm" accentColor={true} type="shield" customStyle="mx-auto my-0" />
              <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                {moderatorGuideLabel}
              </Text>
            </Box>
          </Button>

          <Button plain={true} onClick={onClickButton}>
            <Box customStyle="flex items-center space-x-2">
              <Icon size="sm" accentColor={true} type="faq" customStyle="mx-auto my-0" />
              <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                {moderationFAQLabel}
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default HelloModeratorCard;
