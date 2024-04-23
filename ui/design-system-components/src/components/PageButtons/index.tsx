import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import { ButtonProps } from '@akashaorg/design-system-core/lib/components/Button/types';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type PageButtonsProps = {
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  buttonSize?: ButtonProps['size'];
  cancelButtonVariant?: ButtonProps['variant'];
  confirmButtonVariant?: ButtonProps['variant'];
  confirmButtonDisabled?: boolean;
  onCancelButtonClick?: () => void;
  onConfirmButtonClick?: () => void;
};

export const PageButtons: React.FC<PageButtonsProps> = props => {
  const {
    cancelButtonLabel,
    confirmButtonLabel,
    buttonSize = 'md',
    cancelButtonVariant,
    confirmButtonVariant = 'primary',
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
              size={buttonSize}
              variant={cancelButtonVariant}
              label={cancelButtonLabel}
              onClick={handleCancelButtonClick}
            />
          )}
          {!cancelButtonVariant && (
            <Button
              variant="text"
              size={buttonSize}
              label={cancelButtonLabel}
              onClick={handleCancelButtonClick}
            />
          )}
        </>
      )}

      {confirmButtonLabel && (
        <Button
          size={buttonSize}
          variant={confirmButtonVariant}
          label={confirmButtonLabel}
          disabled={confirmButtonDisabled}
          onClick={handleConfirmButtonClick}
        />
      )}
    </Stack>
  );
};
