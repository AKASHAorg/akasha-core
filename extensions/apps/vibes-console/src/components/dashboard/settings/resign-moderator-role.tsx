import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
      <Stack spacing="gap-y-4" customStyle="mb-8">
        <Typography>{textLine1Label}</Typography>

        <Stack spacing="gap-y-2">
          <Stack spacing="gap-x-2">
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
