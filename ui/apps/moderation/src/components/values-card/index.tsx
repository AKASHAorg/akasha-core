import React from 'react';
import DS from '@akashaorg/design-system';

type ModerationValue = {
  path: string;
  title: string;
  assetName: string;
  description: string;
};
export interface ModerationValuesCardProps {
  titleLabel: string;
  subtitleLabel: string;
  ctaLabel: string;
  ctaUrl?: string;
  values: ModerationValue[];
  onValueClick: (path: ModerationValue['path']) => () => void;
}

const { Anchor, BasicCardBox, Box, ModerationValueCard, Text } = DS;

const ModerationValuesCard: React.FC<ModerationValuesCardProps> = props => {
  const { titleLabel, subtitleLabel, ctaLabel, ctaUrl, values, onValueClick } = props;

  return (
    <BasicCardBox pad="medium" gap="medium" margin={{ bottom: 'medium' }}>
      <Text size="large" weight="bold" textAlign="center">
        {titleLabel}
      </Text>
      <Text size="medium" textAlign="center" margin={{ bottom: 'xxsmall' }}>
        {subtitleLabel}
      </Text>
      <Box direction="row" wrap={true} justify="between">
        {values.map((value, idx) => (
          <Box
            key={value.title + idx}
            width="31.5%"
            height="7.5rem"
            margin={{ ...(idx < values.length - 3 && { bottom: 'medium' }) }}
          >
            <ModerationValueCard
              isMini={true}
              label={value.title}
              assetName={value.assetName}
              onClick={onValueClick(value.path)}
            />
          </Box>
        ))}
      </Box>
      {ctaLabel && (
        <Anchor
          href={ctaUrl}
          size="large"
          weight="normal"
          target="_blank"
          color="accentText"
          margin={{ vertical: 'small' }}
          style={{ textDecoration: 'none', textAlign: 'end' }}
        >
          {ctaLabel}
        </Anchor>
      )}
    </BasicCardBox>
  );
};

export default ModerationValuesCard;
