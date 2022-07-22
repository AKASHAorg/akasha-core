import React from 'react';

import DS from '@akashaorg/design-system';

const { Anchor, Box, HorizontalDivider, Icon, MainAreaCardBox, Text } = DS;

type CardMenuItem = {
  label: string;
  value?: Record<string, unknown>[];
};

interface IDevProfileCardProps {
  titleLabel: string;
  subtitleLabels: string[];
  cardMenuItems: CardMenuItem[];
  ctaUrl: string;
}

const DevProfileCard: React.FC<IDevProfileCardProps> = props => {
  const { titleLabel, subtitleLabels, cardMenuItems, ctaUrl } = props;

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
            onClick={() => null}
          >
            <Text size="large" weight="bold">
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
