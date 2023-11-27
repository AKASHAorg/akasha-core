import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Faq, Shield } from '@akashaorg/design-system-core/lib/components/Icon/akasha-icons';
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
    <Card padding={16}>
      <Stack align="center" spacing="gap-y-6">
        <Text variant="h6" weight="bold">
          {titleLabel}
        </Text>

        <Text variant="body2" color={{ light: 'grey5', dark: 'grey6' }}>
          {subtitleLabel}
        </Text>

        <Stack direction="row" spacing="gap-x-6" justify="center">
          <a href={moderatorGuideUrl} target="_blank" rel="noreferrer noopener">
            <Button plain={true}>
              <Stack direction="row" align="center" spacing="gap-x-2">
                <Icon size="sm" accentColor={true} icon={<Shield />} customStyle="mx-auto my-0" />
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {moderatorGuideLabel}
                </Text>
              </Stack>
            </Button>
          </a>

          <a href={moderationFAQUrl} target="_blank" rel="noreferrer noopener">
            <Button plain={true}>
              <Stack direction="row" align="center" spacing="gap-x-2">
                <Icon size="sm" accentColor={true} icon={<Faq />} customStyle="mx-auto my-0" />
                <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                  {moderationFAQLabel}
                </Text>
              </Stack>
            </Button>
          </a>
        </Stack>
      </Stack>
    </Card>
  );
};

export default HelloModeratorCard;
