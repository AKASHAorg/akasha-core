import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Checkbox from '@akashaorg/design-system-core/lib/components/Checkbox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import PageButtons, { IPageButtonsProps } from '../../dashboard/page-buttons';

export interface IBMContactInfoProps extends IPageButtonsProps {
  titleLabel: string;
  subtitleLabel: string;
  discordLabel: string;
  discordPlaceholderLabel: string;
  emailLabel: string;
  emailPlaceholderLabel: string;
  fillFromProfileLabel: string;
  checks: string[];
  onFillFromProfileClick: () => void;
}

const BMContactInfo: React.FC<IBMContactInfoProps> = props => {
  const {
    titleLabel,
    subtitleLabel,
    discordLabel,
    discordPlaceholderLabel,
    emailLabel,
    emailPlaceholderLabel,
    fillFromProfileLabel,
    checks,
    onFillFromProfileClick,
  } = props;

  return (
    <BasicCardBox pad="p-4">
      <Box customStyle="flex flex-col space-y-4">
        <Text variant="h5" align="center">
          {titleLabel}
        </Text>

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
          <Checkbox key={check + idx} id={`${idx}`} label={check} name={check} value={check} />
        ))}

        <Box customStyle="flex space-x-6 items-center justify-end">
          <PageButtons {...props} />
        </Box>
      </Box>
    </BasicCardBox>
  );
};

export default BMContactInfo;
