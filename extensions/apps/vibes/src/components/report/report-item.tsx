import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
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

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Typography>
          {introLabel}{' '}
          <Typography variant="xs" className="font-medium font-normal">
            {`(${subTextLabel})`}
          </Typography>
        </Typography>

        {step === 0 && (
          <>
            <CategoryPills {...props} />

            <Stack spacing="gap-y-2">
              {selectedReason && (
                <>
                  <Typography variant="h6">{`🛑 ${selectedReason.title}`}</Typography>
                  <Typography variant="xs" className="font-medium font-normal">
                    {selectedReason.description}
                  </Typography>
                </>
              )}
            </Stack>
          </>
        )}

        {step === 1 && (
          <>
            <Textarea
              placeholder={reasonPlaceholderLabel}
              onChange={() => {
                /** */
              }}
            />

            <SubtitleRenderer {...props} textVariant="xs" className="text-grey7 dark:text-grey6" />
          </>
        )}
      </Stack>
    </PageHeader>
  );
};
