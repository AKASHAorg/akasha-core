import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Stack spacing="gap-y-6" customStyle="mt-2">
      <TextField
        label={messageNameTitleLabel}
        placeholder={messageNameInputPlaceholder}
        type="text"
      />

      <Stack spacing="gap-y-1">
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
      </Stack>
    </Stack>
  );
};
