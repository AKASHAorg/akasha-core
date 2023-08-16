import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type HelloModeratorCardProps = {
  titleLabel: string;
  subtitleLabel: string;
  moderatorGuideLabel: string;
  moderatorGuideUrl: string;
  moderationFAQLabel: string;
  moderationFAQUrl: string;
};
const HelloModeratorCard: React.FC<HelloModeratorCardProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    moderatorGuideLabel,
    moderatorGuideUrl,
    moderationFAQLabel,
    moderationFAQUrl,
  } = props;

  return (
    <Card padding="p-4">
      <Box customStyle="flex flex-col items-center space-y-6">
        <Text variant="h6" weight="bold">
          {titleLabel}
        </Text>

        <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>

        <Box customStyle="flex space-x-6 justify-center">
          <a href={moderatorGuideUrl} target="_blank" rel="noreferrer noopener">
            <Button plain={true}>
              <Box customStyle="flex items-center space-x-2">
                <Icon size="sm" accentColor={true} type="shield" customStyle="mx-auto my-0" />
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {moderatorGuideLabel}
                </Text>
              </Box>
            </Button>
          </a>

          <a href={moderationFAQUrl} target="_blank" rel="noreferrer noopener">
            <Button plain={true}>
              <Box customStyle="flex items-center space-x-2">
                <Icon size="sm" accentColor={true} type="faq" customStyle="mx-auto my-0" />
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {moderationFAQLabel}
                </Text>
              </Box>
            </Button>
          </a>
        </Box>
      </Box>
    </Card>
  );
};

export default HelloModeratorCard;
