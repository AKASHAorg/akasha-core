import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type SectionHeaderProps = TableProps & {
  titleLabel: string;
  buttonLabel: string;
  noItemLabel: string;
  onButtonClick: () => void;
};

export const SectionRenderer: React.FC<SectionHeaderProps> = props => {
  const {
    titleLabel,
    buttonLabel,
    theadValues,
    rows,
    customThStyle,
    customTdStyle,
    noItemLabel,
    onButtonClick,
  } = props;
  return (
    <Stack spacing="gap-y-4">
      <Stack direction="row" justify="between">
        <Text variant="h5">{titleLabel}</Text>
        {!!rows.length && (
          <Button variant="text" size="md" label={buttonLabel} onClick={onButtonClick} />
        )}
      </Stack>
      {!rows.length && (
        <Card>
          <Text variant="button-sm" weight="bold" color={{ light: 'grey4', dark: 'grey6' }}>
            {noItemLabel}
          </Text>
        </Card>
      )}

      {!!rows.length && (
        <Card padding={0}>
          <Table
            theadValues={theadValues}
            rows={rows}
            customThStyle={customThStyle}
            customTdStyle={customTdStyle}
          />
        </Card>
      )}
    </Stack>
  );
};
