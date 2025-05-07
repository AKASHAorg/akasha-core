import React from 'react';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import RadioButton from '@akashaorg/design-system-core/lib/components/RadioButton';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
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
          <Stack direction="row" spacing="gap-x-4">
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
          <Input
            placeholder={`${section1.placeholder} ...`}
            maxLength={100}
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Stack spacing="gap-y-2">
          <Text variant="label">{section2.title}?</Text>
          <Textarea
            placeholder={`${section2.placeholder} ...`}
            maxLength={200}
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
