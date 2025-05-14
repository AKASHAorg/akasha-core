import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import {
  PageHeader,
  PageHeaderProps,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack spacing="gap-y-4" customStyle="mb-8">
        <Stack direction="row" align="center" justify="between">
          <Typography variant="sm" bold className="text-black dark:text-grey6">
            {one.title}
          </Typography>
          <Typography variant="xs" className="font-medium font-normal text-grey4 dark:text-grey7">
            01-Jan-2015
          </Typography>
        </Stack>
        <Separator />
        <Stack direction="row" align="start" justify="between">
          <Stack spacing="gap-y-3">
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
          <Button variant="text" size="md" label={changeLimitLabel} onClick={onChangeButtonClick} />
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
