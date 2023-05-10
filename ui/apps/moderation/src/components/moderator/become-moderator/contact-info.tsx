import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import SteppedActionWrapper, { ISteppedActionWrapperProps } from './stepped-action-wrapper';

export interface IBMContactInfoProps extends ISteppedActionWrapperProps {
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
}

const BMContactInfo: React.FC<IBMContactInfoProps> = props => {
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

      <Box>
        <TextField label={discordLabel} placeholder={discordPlaceholderLabel} type="text" />
      </Box>

      <Box>
        <TextField label={emailLabel} placeholder={emailPlaceholderLabel} type="text" />
      </Box>

      <Box customStyle="flex justify-end">
        <Button plain={true} onClick={onFillFromProfileClick}>
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
      </Box>

      {checks.map((check, idx) => (
        <Checkbox
          key={check + idx}
          id={`${idx}`}
          label={check}
          name={check}
          value={check}
          isSelected={!!checkedState[idx]}
          handleChange={onCheckBoxClick(idx)}
        />
      ))}
    </SteppedActionWrapper>
  );
};

export default BMContactInfo;
