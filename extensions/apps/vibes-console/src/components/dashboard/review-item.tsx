import React from 'react';
import DatePicker from '@akashaorg/design-system-core/lib/components/DatePicker';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import { RadioGroup, RadioGroupItem } from '@akashaorg/ui/lib/components/radio-group';

import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  SubtitleRenderer,
  SubtitleRendererProps,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Label } from '@akashaorg/ui/lib/components/label';

export type ReviewItemProps = PageHeaderProps &
  SubtitleRendererProps & {
    section1Label: string;
    section2Label?: string;
    section3Label: string;
    radioButtons?: { label: string; value: string }[];
    selectedPeriod?: string;
    datePlaceholderLabel: string;
    reasonPlaceholderLabel: string;
    handleRadioChange: (value: string) => void;
    handleReasonClick: (id: string) => void;
  };

export const ReviewItem: React.FC<ReviewItemProps> = props => {
  const {
    section1Label,
    section2Label,
    section3Label,
    radioButtons,
    selectedPeriod,
    datePlaceholderLabel,
    reasonPlaceholderLabel,
    handleRadioChange,
    handleReasonClick,
  } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Typography variant="h6">{section1Label}</Typography>
        <Stack customStyle="gap-y-2 md:flex-row md:gap-x-2">
          <ReportReasonPill
            reason="Bullying and harassment"
            reportCount={46}
            handleClick={() => handleReasonClick('bh-123')}
          />
          <ReportReasonPill
            reason="Hate speech"
            reportCount={15}
            handleClick={() => handleReasonClick('hs-123')}
          />
        </Stack>

        {section2Label && (
          <Stack spacing="gap-y-2">
            <Typography variant="h6">{section2Label}</Typography>
            <Stack direction="row" customStyle="gap-x-3 md:gap-x-6">
              <RadioGroup onValueChange={handleRadioChange} defaultValue={selectedPeriod}>
                {radioButtons.map(buttonInfo => (
                  <div key={buttonInfo.label} className="">
                    <RadioGroupItem id={buttonInfo.value} value={buttonInfo.value} />
                    <Label htmlFor={buttonInfo.value}>{buttonInfo.label}</Label>
                  </div>
                ))}
              </RadioGroup>
            </Stack>
            {/* show date picker if selectedPeriod is 'Other' */}
            {selectedPeriod === 'Other' && <DatePicker placeholderLabel={datePlaceholderLabel} />}
          </Stack>
        )}

        <Typography variant="h6">{section3Label}</Typography>
        <Textarea
          placeholder={reasonPlaceholderLabel}
          onChange={() => {
            /** */
          }}
        />
        <SubtitleRenderer {...props} textVariant="xs" className="text-grey7 dark:text-grey6" />
      </Stack>
    </PageHeader>
  );
};
