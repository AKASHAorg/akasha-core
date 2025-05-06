import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
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
        <Text>{textLine1Label}</Text>

        <Stack spacing="gap-y-2">
          <Stack spacing="gap-x-2">
            <Text weight="bold">{reasonTitleLabel}</Text>
            <Text customStyle="text-[0.875rem] leading-[1.375rem] font-light">{`(${optionalLabel})`}</Text>
          </Stack>

          <Textarea
            placeholder={reasonPlaceholderLabel}
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Text>{textLine2Label}</Text>
      </Stack>
    </PageHeader>
  );
};
