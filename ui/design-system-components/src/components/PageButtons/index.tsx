import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type PageButtonsProps = {
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  cancelButtonVariant?: ButtonProps['variant'];
  confirmButtonDisabled?: boolean;
  onCancelButtonClick?: () => void;
  onConfirmButtonClick?: () => void;
};

export const PageButtons: React.FC<PageButtonsProps> = props => {
  const {
    cancelButtonLabel,
    confirmButtonLabel,
    cancelButtonVariant,
    confirmButtonDisabled,
    onCancelButtonClick,
    onConfirmButtonClick,
  } = props;

  const handleCancelButtonClick = () => {
    if (onCancelButtonClick && typeof onCancelButtonClick === 'function') {
      onCancelButtonClick();
    }
  };

  const handleConfirmButtonClick = () => {
    if (onConfirmButtonClick && typeof onConfirmButtonClick === 'function') {
      onConfirmButtonClick();
    }
  };

  return (
    <Stack direction="row" spacing="gap-x-4" align="center" justify="end">
      {cancelButtonLabel && (
        <>
          {cancelButtonVariant && (
            <Button
              size="md"
              variant={cancelButtonVariant}
              label={cancelButtonLabel}
              onClick={handleCancelButtonClick}
            />
          )}
          {!cancelButtonVariant && (
            <Button plain={true} onClick={handleCancelButtonClick}>
              <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
                {cancelButtonLabel}
              </Text>
            </Button>
          )}
        </>
      )}

      {confirmButtonLabel && (
        <Button
          size="md"
          variant="primary"
          label={confirmButtonLabel}
          disabled={confirmButtonDisabled}
          onClick={handleConfirmButtonClick}
        />
      )}
    </Stack>
  );
};
