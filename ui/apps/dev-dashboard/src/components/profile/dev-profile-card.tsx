import React from 'react';

import { NavigateToParams } from '@akashaorg/typings/ui';

import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
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

  const handleClickMenuItem = (route: string) => () => {
    navigateTo?.({
      appName: '@akashaorg/app-dev-dashboard',
      getNavigationUrl: () => menuRoute[route],
    });
  };

  return (
    <BasicCardBox pad="p-0">
      <Box customStyle="p-4">
        <Text variant="h5" align="center" weight="bold">
          {titleLabel}
        </Text>

        <Text color={{ light: 'grey4', dark: 'grey6' }} customStyle="mt-2">
          {subtitleLabels[0]}{' '}
          <Anchor href={ctaUrl} customStyle="font-bold">
            {subtitleLabels[1]}
          </Anchor>{' '}
          {subtitleLabels[2]}
        </Text>
      </Box>

      {cardMenuItems.map((item, idx) => (
        <Box key={idx}>
          <Divider />

          <Box customStyle="p-4">
            <Button plain={true} onClick={handleClickMenuItem(item.route)} customStyle="w-full">
              <Box customStyle="flex justify-between items-center">
                <Text variant="h6" weight="bold">
                  {item.label}
                </Text>

                <Box customStyle="flex items-center space-x-1">
                  {item.value && (
                    <Text variant="subtitle1" color={{ light: 'grey4', dark: 'grey6' }}>
                      {typeof item.value === 'number' ? item.value : item.value.length}
                    </Text>
                  )}

                  <Icon
                    type="ChevronRightIcon"
                    color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                  />
                </Box>
              </Box>
            </Button>
          </Box>
        </Box>
      ))}
    </BasicCardBox>
  );
};

export default DevProfileCard;
