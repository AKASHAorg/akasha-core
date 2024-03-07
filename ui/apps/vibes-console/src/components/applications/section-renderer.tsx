import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type SectionHeaderProps = {
  titleLabel: string;
  buttonLabel: string;
  items: Record<string, unknown>[];
  noItemLabel: string;
  onButtonClick: () => void;
};

export const SectionRenderer: React.FC<SectionHeaderProps> = props => {
  const { titleLabel, buttonLabel, items, noItemLabel, onButtonClick } = props;

  return (
    <Stack spacing="gap-y-2">
      <Stack direction="row" justify="between">
        <Text variant="h5">{titleLabel}</Text>
        {!!items.length && (
          <Button plain={true} onClick={onButtonClick}>
            <Text variant="button-md" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
              {buttonLabel}
            </Text>
          </Button>
        )}
      </Stack>

      {!items.length && (
        <Card>
          <Text variant="button-sm" weight="bold" color={{ light: 'grey4', dark: 'grey6' }}>
            {noItemLabel}
          </Text>
        </Card>
      )}
    </Stack>
  );
};
