import React from 'react';

import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';

export interface IDismissModeratorProps {
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
}

const DismissModerator: React.FC<IDismissModeratorProps> = props => {
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
    <BasicCardBox pad="p-4 space-y-3">
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

      <Box customStyle="flex space-x-6 items-center justify-end p-4 my-2">
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
      </Box>
    </BasicCardBox>
  );
};

export default DismissModerator;
