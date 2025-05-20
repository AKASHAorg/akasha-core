import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
export type ResignRoleProps = PageHeaderProps & {
  textLine1Label: string;
  reasonTitleLabel: string;
  reasonPlaceholderLabel: string;
  optionalLabel: string;
  textLine2Label: string;
};
export const ResignRole: React.FC<ResignRoleProps> = props => {
  const {
    textLine1Label,
    reasonTitleLabel,
    reasonPlaceholderLabel,
    optionalLabel,
    textLine2Label,
  } = props;
  return (
    <PageHeader {...props}>
      <Stack spacing={4} className="mb-8">
        <Typography>{textLine1Label}</Typography>

        <Stack spacing={2}>
          <Stack spacing={2}>
            <Typography bold>{reasonTitleLabel}</Typography>
            <Typography className="text-[0.875rem] leading-[1.375rem] font-light">{`(${optionalLabel})`}</Typography>
          </Stack>

          <Textarea
            placeholder={reasonPlaceholderLabel}
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Typography>{textLine2Label}</Typography>
      </Stack>
    </PageHeader>
  );
};
