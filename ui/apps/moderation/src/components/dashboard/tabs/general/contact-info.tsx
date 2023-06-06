import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import TextField from '@akashaorg/design-system-core/lib/components/TextField';

import { PageHeaderProps, PageHeader } from '../../../common';

export type EditContactInfoProps = PageHeaderProps & {
  usernameLabel: string;
  usernamePlaceholderLabel: string;
  emailLabel: string;
  emailPlaceholderLabel: string;
  fillfromProfileLabel: string;
};

const EditContactInfo: React.FC<EditContactInfoProps> = props => {
  const {
    usernameLabel,
    usernamePlaceholderLabel,
    emailLabel,
    emailPlaceholderLabel,
    fillfromProfileLabel,
  } = props;

  const handleFillInfo = () => {
    /** fill info from profile */
  };

  return (
    <PageHeader {...props}>
      <Box customStyle="flex flex-col space-y-4">
        <TextField label={usernameLabel} placeholder={usernamePlaceholderLabel} type="text" />

        <TextField label={emailLabel} placeholder={emailPlaceholderLabel} type="text" />

        <Box customStyle="self-end">
          <Button plain={true} onClick={handleFillInfo}>
            <Text color={{ light: 'secondaryLight', dark: 'secondaryDark' }} weight="bold">
              {fillfromProfileLabel}
            </Text>
          </Button>
        </Box>
      </Box>
    </PageHeader>
  );
};

export default EditContactInfo;
