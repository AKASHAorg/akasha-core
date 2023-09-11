import React from 'react';

import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

export type DismissModeratorProps = {
  titleLabel: string;
  placeholderLabel: string;
  subtitleLabel: string;
  codefConductLabel: string;
  andLabel: string;
  termsOfServiceLabel: string;
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
};

const DismissModerator: React.FC<DismissModeratorProps> = props => {
  const {
    titleLabel,
    placeholderLabel,
    subtitleLabel,
    codefConductLabel,
    andLabel,
    termsOfServiceLabel,
    cancelButtonLabel,
    confirmButtonLabel,
    onCancelButtonClick,
    onConfirmButtonClick,
  } = props;

  return (
    <Card padding={16} customStyle="space-y-3">
      <Text variant="h6">{titleLabel}</Text>

      <TextField placeholder={placeholderLabel} type="multiline" />

      <Text variant="footnotes2">
        {subtitleLabel}{' '}
        <Button plain={true}>
          <Text
            as="span"
            variant="footnotes2"
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          >
            {codefConductLabel}
          </Text>
        </Button>{' '}
        {andLabel}{' '}
        <Button plain={true}>
          <Text
            as="span"
            variant="footnotes2"
            color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
          >
            {termsOfServiceLabel}
          </Text>
        </Button>
      </Text>

      <Stack align="center" justify="end" spacing="gap-x-6" customStyle="p-4 my-2">
        <Button plain={true} onClick={onCancelButtonClick}>
          <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {cancelButtonLabel}
          </Text>
        </Button>

        <Button
          size="md"
          variant="primary"
          label={confirmButtonLabel}
          onClick={onConfirmButtonClick}
        />
      </Stack>
    </Card>
  );
};

export default DismissModerator;
