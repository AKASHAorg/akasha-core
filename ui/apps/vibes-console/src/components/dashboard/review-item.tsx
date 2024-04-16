import React from 'react';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import {
  SubtitleRenderer,
  SubtitleRendererProps,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';

export type ReviewItemProps = PageHeaderProps &
  SubtitleRendererProps & {
    section1Label: string;
    section2Label: string;
    reasonPlaceholderLabel: string;
  };

export const ReviewItem: React.FC<ReviewItemProps> = props => {
  const { section1Label, section2Label, reasonPlaceholderLabel } = props;

  const textColor = { light: 'grey7', dark: 'grey6' } as const;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Text variant="h6">{section1Label}</Text>
        <Stack customStyle="gap-y-2 md:(flex-row gap-x-2)">
          <ReportReasonPill reason="Bullying and harassment" reportCount={46} />
          <ReportReasonPill reason="Hate speech" reportCount={15} />
        </Stack>
        <Text variant="h6">{section2Label}</Text>
        <TextField
          placeholder={reasonPlaceholderLabel}
          type="multiline"
          onChange={() => {
            /** */
          }}
        />
        <SubtitleRenderer
          {...props}
          textVariant="footnotes2"
          textAlign="start"
          fontWeight="normal"
          textColor={textColor}
        />
      </Stack>
    </PageHeader>
  );
};
