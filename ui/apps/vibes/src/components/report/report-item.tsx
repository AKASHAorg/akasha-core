import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import {
  SubtitleRendererProps,
  SubtitleRenderer,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';
import { CategoryPills, CategoryPillsProps } from '../common';
import { ReasonType } from '../../utils';

export type ReportItemProps = PageHeaderProps &
  CategoryPillsProps &
  SubtitleRendererProps & {
    step: number;
    introLabel: string;
    subTextLabel: string;
    selectedReason: ReasonType | null;
    reasonPlaceholderLabel: string;
  };

export const ReportItem: React.FC<ReportItemProps> = props => {
  const { step, introLabel, subTextLabel, selectedReason, reasonPlaceholderLabel } = props;

  const textColor = { light: 'grey7', dark: 'grey6' } as const;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Text>
          {introLabel}{' '}
          <Text as="span" variant="footnotes2" weight="normal" color={textColor}>
            {`(${subTextLabel})`}
          </Text>
        </Text>

        {step === 0 && (
          <>
            <CategoryPills {...props} />

            <Stack spacing="gap-y-2">
              {selectedReason && (
                <>
                  <Text variant="h6">{`🛑 ${selectedReason.title}`}</Text>
                  <Text variant="footnotes2" weight="normal">
                    {selectedReason.description}
                  </Text>
                </>
              )}
            </Stack>
          </>
        )}

        {step === 1 && (
          <>
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
          </>
        )}
      </Stack>
    </PageHeader>
  );
};
