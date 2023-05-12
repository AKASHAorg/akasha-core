import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
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

        <Box customStyle="flex space-x-4 justify-center">
          <Button plain={true} onClick={onClickButton}>
            <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {moderatorGuideLabel}
            </Text>
          </Button>

          <Button plain={true} onClick={onClickButton}>
            <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {moderationFAQLabel}
            </Text>
          </Button>
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default HelloModeratorCard;
