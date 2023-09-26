import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import {
  SteppedActionWrapperProps,
  SteppedActionWrapper,
} from '@akashaorg/design-system-components/lib/components/SteppedActionWrapper';

export type BMContactInfoProps = SteppedActionWrapperProps & {
  titleLabel: string;
  subtitleLabel: string;
  discordLabel: string;
  discordPlaceholderLabel: string;
  emailLabel: string;
  emailPlaceholderLabel: string;
  fillFromProfileLabel: string;
  checks: string[];
  checkedState: string[];
  onFillFromProfileClick: () => void;
  onCheckBoxClick: (idx: number) => () => void;
};

const BMContactInfo: React.FC<BMContactInfoProps> = props => {
  const {
    subtitleLabel,
    discordLabel,
    discordPlaceholderLabel,
    emailLabel,
    emailPlaceholderLabel,
    fillFromProfileLabel,
    checks,
    checkedState,
    onFillFromProfileClick,
    onCheckBoxClick,
  } = props;

  return (
    <SteppedActionWrapper {...props}>
      <Text variant="footnotes2" weight="light">
        {subtitleLabel}{' '}
      </Text>

      <Stack>
        <TextField label={discordLabel} placeholder={discordPlaceholderLabel} type="text" />
      </Stack>

      <Stack>
        <TextField label={emailLabel} placeholder={emailPlaceholderLabel} type="text" />
      </Stack>

      <Button plain={true} onClick={onFillFromProfileClick} customStyle="w-fit ml-auto">
        <Text
          as="span"
          variant="subtitle2"
          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          weight="bold"
          customStyle="cursor-pointer"
        >
          {fillFromProfileLabel}
        </Text>
      </Button>

      {checks.map((check, idx) => (
        <Checkbox
          key={check + idx}
          id={`${idx}`}
          label={check}
          name={check}
          value={check}
          isSelected={!!checkedState[idx]}
          handleChange={onCheckBoxClick(idx)}
          customStyle="mx-2 my-0"
        />
      ))}
    </SteppedActionWrapper>
  );
};

export default BMContactInfo;
