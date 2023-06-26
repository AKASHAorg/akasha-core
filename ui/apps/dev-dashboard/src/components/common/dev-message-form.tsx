import React from 'react';

import Box from '@akashaorg/design-system-core/lib/components/Box';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

export type DevMessageFormProps = {
  messageNameTitleLabel: string;
  messageNameInputPlaceholder: string;
  messageTitleLabel: string;
  messageInputPlaceholder: string;
  validationStatus: { isError: boolean; errorMessage?: string; extraInfo?: string };
};

export const DevMessageForm: React.FC<DevMessageFormProps> = props => {
  const {
    messageNameTitleLabel,
    messageTitleLabel,
    messageNameInputPlaceholder,
    messageInputPlaceholder,
    validationStatus,
  } = props;

  return (
    <Box customStyle="mt-2 space-y-6">
      <TextField
        label={messageNameTitleLabel}
        placeholder={messageNameInputPlaceholder}
        type="text"
      />

      <Box customStyle="space-y-1">
        <TextField
          label={messageTitleLabel}
          placeholder={messageInputPlaceholder}
          type="multiline"
        />

        {validationStatus.isError && (
          <Text variant="footnotes2" color={{ light: 'errorLight', dark: 'errorDark' }}>
            {validationStatus.errorMessage}
          </Text>
        )}

        {!!validationStatus.extraInfo?.length && (
          <Text variant="footnotes2">*{validationStatus.extraInfo}</Text>
        )}
      </Box>
    </Box>
  );
};
