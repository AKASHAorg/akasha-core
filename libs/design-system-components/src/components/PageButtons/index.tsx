import React from 'react';

import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

type ButtonProps = React.ComponentProps<typeof Button>;

export type PageButtonsProps = {
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  cancelButtonVariant?: ButtonProps['variant'];
  confirmButtonDisabled?: boolean;
  onCancelButtonClick?: () => void;
  onConfirmButtonClick?: () => void;
};

/**
 * Component used to display action buttons in the vibes console app
 */
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
    <Stack direction="row" spacing={4} alignItems="center" justifyContent="end">
      {cancelButtonLabel && (
        <>
          {cancelButtonVariant && (
            <Button onClick={handleCancelButtonClick}>{cancelButtonLabel}</Button>
          )}
          {!cancelButtonVariant && (
            <Button variant="link" onClick={handleCancelButtonClick}>
              {cancelButtonLabel}
            </Button>
          )}
        </>
      )}

      {confirmButtonLabel && (
        <Button disabled={confirmButtonDisabled} onClick={handleConfirmButtonClick}>
          {confirmButtonLabel}
        </Button>
      )}
    </Stack>
  );
};
