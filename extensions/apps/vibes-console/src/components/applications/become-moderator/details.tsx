import React from 'react';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import { RadioGroup, RadioGroupItem } from '@akashaorg/ui/lib/components/radio-group';
import { Label } from '@akashaorg/ui/lib/components/label';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
      radioButtons: {
        label: string;
        value: string;
      }[];
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
  const { footerChecked, section1, section2, onRadioButtonChange, onCheckboxChange } = props;

  return (
    <PageHeader {...props}>
      <Stack spacing="gap-y-4">
        <Stack spacing="gap-y-2">
          <Typography className="font-medium">{section1.title}?</Typography>
          <Typography variant="xs" className="font-medium font-light">
            {section1.subtitle}
          </Typography>
          <Stack direction="row" spacing="gap-x-4">
            <RadioGroup
              defaultValue={section1.radioButtons[0].value}
              onValueChange={onRadioButtonChange}
              className="flex space-x-2"
            >
              {section1.radioButtons.map(b => (
                <div key={b.label} className="space-x-2">
                  <RadioGroupItem id={b.value} value={b.value} />
                  <Label htmlFor={b.value}>{b.value}</Label>
                </div>
              ))}
            </RadioGroup>
          </Stack>
          <Typography variant="xs" className="font-medium font-light">
            {section1.extra}:
          </Typography>
          <Input
            placeholder={`${section1.placeholder} ...`}
            maxLength={100}
            onChange={() => {
              /** */
            }}
          />
        </Stack>

        <Stack spacing="gap-y-2">
          <Typography className="font-medium">{section2.title}?</Typography>
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
          <SubtitleRenderer {...props} textVariant="xs" />
        </Stack>
      </Stack>
    </PageHeader>
  );
};
