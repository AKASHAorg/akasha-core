import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IPageButtonsProps {
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  onCancelButtonClick?: () => void;
  onConfirmButtonClick?: () => void;
}

const PageButtons: React.FC<IPageButtonsProps> = props => {
  const { cancelButtonLabel, confirmButtonLabel, onCancelButtonClick, onConfirmButtonClick } =
    props;

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
    <>
      {cancelButtonLabel && (
        <Button plain={true} onClick={handleCancelButtonClick}>
          <Text weight="bold" color={{ light: 'secondaryLight', dark: 'secondaryDark' }}>
            {cancelButtonLabel}
          </Text>
        </Button>
      )}

      {confirmButtonLabel && (
        <Button
          size="md"
          variant="primary"
          label={confirmButtonLabel}
          onClick={handleConfirmButtonClick}
        />
      )}
    </>
  );
};

export default PageButtons;
