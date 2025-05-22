import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
export type TSection = {
  title: string;
  description?: string;
};
export type AdminSettingsProps = PageHeaderProps & {
  changeLimitLabel: string;
  currentNumberLabel: string;
  sections: {
    one: TSection;
    two: TSection;
    three: TSection;
  };
  onChangeButtonClick: () => void;
};
export const AdminSettings: React.FC<AdminSettingsProps> = props => {
  const {
    sections: { one, two, three },
    currentNumberLabel,
    changeLimitLabel,
    onChangeButtonClick,
  } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing={4} className="mb-8">
        <Stack direction="row" alignItems="center" justifyContent="between">
          <Typography variant="sm" bold className="text-black dark:text-grey6">
            {one.title}
          </Typography>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey7">
            01-Jan-2015
          </Typography>
        </Stack>
        <Separator />
        <Stack direction="row" alignItems="start" justifyContent="between">
          <Stack spacing={3}>
            <Typography variant="sm" bold className="text-black dark:text-grey6">
              {two.title}
            </Typography>
            <Typography variant="xs" className="font-medium font-normal">
              {two.description}
            </Typography>
            <Typography variant="xs" bold className="text-grey4 dark:text-grey7">
              {currentNumberLabel}:{' '}
              <Typography variant="xs" className="font-medium">
                65
              </Typography>
            </Typography>
          </Stack>
          <Button variant="link" onClick={onChangeButtonClick}>
            {changeLimitLabel}
          </Button>
        </Stack>
        <Separator />
        <Stack>
          <Typography variant="sm" bold className="text-black dark:text-grey6">
            {three.title}
          </Typography>
          <Typography variant="xs" className="font-medium font-normal">
            {three.description}
          </Typography>
        </Stack>
      </Stack>
    </PageHeader>
  );
};
