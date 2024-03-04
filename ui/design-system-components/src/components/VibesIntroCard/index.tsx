import React from 'react';
import Anchor from '@akashaorg/design-system-core/lib/components/Anchor';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Button from '@akashaorg/design-system-core/lib/components/Button';

export type OverviewCTA = {
  label: string;
  url: string;
  handler?: () => void;
};

export type VibesIntroCardProps = {
  titleLabel: string;
  subtitleLabel: string;
  overviewCTAArr: OverviewCTA[];
};

const VibesIntroCard: React.FC<VibesIntroCardProps> = props => {
  const { titleLabel, subtitleLabel, overviewCTAArr } = props;

  return (
    <Card padding={16}>
      <Stack spacing="gap-4">
        <Text variant="h5">{titleLabel}</Text>

        {subtitleLabel && (
          <Text variant="body2" weight="light" color={{ light: 'grey5', dark: 'grey6' }}>
            {subtitleLabel}.
          </Text>
        )}

        {overviewCTAArr && overviewCTAArr.length > 0 && (
          <Stack justify="between" spacing="gap-y-4">
            {overviewCTAArr.map(({ url, label, handler }, idx) => (
              <Stack key={label + idx}>
                {handler && typeof handler === 'function' ? (
                  <Button plain={true} onClick={handler}>
                    <Text
                      weight="bold"
                      variant="button-md"
                      color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                    >
                      {label}
                    </Text>
                  </Button>
                ) : (
                  <Anchor href={url} dataTestId={`${label}-link`} customStyle="text-sm font-bold">
                    {label}
                  </Anchor>
                )}
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

export default VibesIntroCard;
