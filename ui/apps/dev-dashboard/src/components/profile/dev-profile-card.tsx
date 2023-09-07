import React from 'react';

import { NavigateToParams } from '@akashaorg/typings/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { DevKeyCardType } from '@akashaorg/design-system-components/lib/components/DevKeyCard';

import menuRoute from '../../routes';

type CardMenuItem = {
  label: string;
  route: string;
  value?: DevKeyCardType[] | Record<string, unknown>[] | number;
};

export type DevProfileCardProps = {
  titleLabel: string;
  subtitleLabels: string[];
  cardMenuItems: CardMenuItem[];
  ctaUrl: string;
  navigateTo: (params: NavigateToParams) => void;
};

const DevProfileCard: React.FC<DevProfileCardProps> = props => {
  const { titleLabel, subtitleLabels, cardMenuItems, ctaUrl, navigateTo } = props;

  const [subtitleStart, subtitleCTA, subtitleCompletion] = subtitleLabels;

  const handleClickMenuItem = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[route],
    });
  };

  return (
    <Card padding={0}>
      <Stack padding="p-4">
        <Text variant="h5" align="center" weight="bold">
          {titleLabel}
        </Text>

        <Text color={{ light: 'grey4', dark: 'grey6' }} customStyle="mt-2">
          {subtitleStart}{' '}
          <Anchor href={ctaUrl} customStyle="font-bold">
            {subtitleCTA}
          </Anchor>{' '}
          {subtitleCompletion}
        </Text>
      </Stack>

      {cardMenuItems.map((item, idx) => (
        <Stack key={idx}>
          <Divider />

          <Stack padding="p-4">
            <Button plain={true} onClick={handleClickMenuItem(item.route)} customStyle="w-full">
              <Stack align="center" justify="between">
                <Text variant="h6" weight="bold">
                  {item.label}
                </Text>

                <Stack align="center" spacing="gap-x-1">
                  {item.value && (
                    <Text variant="subtitle1" color={{ light: 'grey4', dark: 'grey6' }}>
                      {typeof item.value === 'number' ? item.value : item.value.length}
                    </Text>
                  )}

                  <Icon
                    type="ChevronRightIcon"
                    color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  />
                </Stack>
              </Stack>
            </Button>
          </Stack>
        </Stack>
      ))}
    </Card>
  );
};

export default DevProfileCard;
