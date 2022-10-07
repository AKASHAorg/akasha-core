import React from 'react';

import DS from '@akashaorg/design-system';
import { NavigateToParams } from '@akashaorg/typings/ui';
import { DevKeyCardType } from '@akashaorg/design-system/lib/components/DevKeyCard';

import menuRoute from '../../../routes';

const { Anchor, Box, HorizontalDivider, Icon, MainAreaCardBox, Text } = DS;

type CardMenuItem = {
  label: string;
  route: string;
  value?: DevKeyCardType[] | Record<string, unknown>[];
};

interface IDevProfileCardProps {
  titleLabel: string;
  subtitleLabels: string[];
  cardMenuItems: CardMenuItem[];
  ctaUrl: string;
  navigateTo: (params: NavigateToParams) => void;
}

const DevProfileCard: React.FC<IDevProfileCardProps> = props => {
  const { titleLabel, subtitleLabels, cardMenuItems, ctaUrl, navigateTo } = props;

  const handleClickMenuItem = (route: string) => () => {
    navigateTo({
      appName: '@akashaorg/app-profile',
      getNavigationUrl: () => menuRoute[route],
    });
  };

  return (
    <MainAreaCardBox>
      <Box pad="medium">
        {titleLabel && (
          <Text size="large" margin={{ bottom: 'xsmall' }} weight="bold">
            {titleLabel}
          </Text>
        )}
        {subtitleLabels && (
          <Text size="large" margin={{ bottom: 'xsmall' }}>
            {subtitleLabels[0]}{' '}
            <Anchor
              href={ctaUrl}
              size="large"
              weight="normal"
              target="_blank"
              color="accentText"
              style={{ textDecoration: 'none' }}
            >
              {subtitleLabels[1]}
            </Anchor>{' '}
            {subtitleLabels[2]}
          </Text>
        )}
      </Box>
      <HorizontalDivider />
      {cardMenuItems.map((item, idx) => (
        <React.Fragment key={idx}>
          <Box
            pad={{ vertical: 'large', horizontal: 'medium' }}
            align="center"
            direction="row"
            justify="between"
            onClick={handleClickMenuItem(item.route)}
          >
            <Text size="large" weight={500}>
              {item.label}
            </Text>
            <Box direction="row" align="center" gap="xsmall">
              {item.value && (
                <Text size="large" color="secondaryText">
                  {item.value.length}
                </Text>
              )}
              <Icon type="chevronRight" />
            </Box>
          </Box>
          {idx < cardMenuItems.length - 1 && <HorizontalDivider />}
        </React.Fragment>
      ))}
    </MainAreaCardBox>
  );
};

export default DevProfileCard;
