import React from 'react';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import RadioButton from '@akashaorg/design-system-core/lib/components/RadioButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import {
  PageHeaderProps,
  PageHeader,
} from '@akashaorg/design-system-components/lib/components/PageHeader';
import {
  SubtitleRenderer,
  SubtitleRendererProps,
} from '@akashaorg/design-system-components/lib/components/SubtitleRenderer';

export type BMDetailsProps = PageHeaderProps &
  SubtitleRendererProps & {
    selectedButton: string | null;
    footerChecked: boolean;
    section1: {
      title: string;
      subtitle: string;
      radioButtons: { label: string; value: string }[];
      extra: string;
      placeholder: string;
      caption: string;
    };
    section2: {
      title: string;
      placeholder: string;
      caption: string;
    };
    onRadioButtonChange: (value: string) => void;
    onCheckboxChange: () => void;
  };

export const BMDetails: React.FC<BMDetailsProps> = props => {
  const {
    selectedButton,
    footerChecked,
    section1,
    section2,
    onRadioButtonChange,
    onCheckboxChange,
  } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Stack spacing="gap-y-2">
          <Text variant="label">{section1.title}?</Text>
          <Text variant="footnotes2" weight="light">
            {section1.subtitle}
          </Text>
          <Stack direction="row">
            {section1.radioButtons.map(b => (
              <RadioButton
                id={b.value}
                key={b.label}
                label={b.label}
                value={b.value}
                isSelected={selectedButton === b.value}
                handleChange={() => onRadioButtonChange(b.value)}
              />
            ))}
          </Stack>
          <Text variant="footnotes2" weight="light">
            {section1.extra}:
          </Text>
          <TextField
            placeholder={`${section1.placeholder} ...`}
            type="text"
            maxLength={100}
            caption={`${section1.caption}.`}
            justifyCaption="end"
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Stack spacing="gap-y-2">
          <Text variant="label">{section2.title}?</Text>
          <TextField
            placeholder={`${section2.placeholder} ...`}
            type="multiline"
            maxLength={200}
            caption={`${section2.caption}.`}
            justifyCaption="end"
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Stack direction="row" spacing="gap-x-4">
          <Checkbox
            id="accept"
            name="accept"
            value="accept"
            handleChange={onCheckboxChange}
            isSelected={footerChecked}
          />
          <SubtitleRenderer
            {...props}
            textVariant="footnotes2"
            textAlign="start"
            fontWeight="normal"
          />
        </Stack>
      </Stack>
    </PageHeader>
  );
};
