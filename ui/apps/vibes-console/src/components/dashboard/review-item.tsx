import React from 'react';
import DatePicker from '@akashaorg/design-system-core/lib/components/DatePicker';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import RadioButton from '@akashaorg/design-system-core/lib/components/RadioButton';
import ReportReasonPill from '@akashaorg/design-system-components/lib/components/ReportReasonPill';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import {
  SubtitleRenderer,
  SubtitleRendererProps,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

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

  const textColor = { light: 'grey7', dark: 'grey6' } as const;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4" customStyle="mb-24">
        <Text variant="h6">{section1Label}</Text>
        <Stack customStyle="gap-y-2 md:(flex-row gap-x-2)">
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
            <Text variant="h6">{section2Label}</Text>
            <Stack direction="row" customStyle="gap-x-3 md:gap-x-6">
              {radioButtons.map(r => (
                <RadioButton
                  key={r.value}
                  id={r.label}
                  label={r.label}
                  value={r.value}
                  isSelected={selectedPeriod === r.value}
                  handleChange={() => handleRadioChange(r.value)}
                />
              ))}
            </Stack>
            {/* show date picker if selectedPeriod is 'Other' */}
            {selectedPeriod === 'Other' && <DatePicker placeholderLabel={datePlaceholderLabel} />}
          </Stack>
        )}

        <Text variant="h6">{section3Label}</Text>
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
