import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Table, { TableProps } from '@akashaorg/design-system-core/lib/components/Table';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
        <Typography variant="h5">{titleLabel}</Typography>
        {!!rows.length && (
          <Button variant="text" size="md" label={buttonLabel} onClick={onButtonClick} />
        )}
      </Stack>
      {!rows.length && (
        <Card>
          <Typography variant="xs" bold className="text-grey4 dark:text-grey6">
            {noItemLabel}
          </Typography>
        </Card>
      )}

      {!!rows.length && (
        <Card className="p-0">
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
