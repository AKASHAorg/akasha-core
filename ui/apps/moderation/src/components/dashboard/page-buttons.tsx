import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export interface IPageButtonsProps {
  cancelButtonLabel: string;
  confirmButtonLabel: string;
  onCancelButtonClick: () => void;
  onConfirmButtonClick: () => void;
}

const PageButtons: React.FC<IPageButtonsProps> = props => {
  const { cancelButtonLabel, confirmButtonLabel, onCancelButtonClick, onConfirmButtonClick } =
    props;

  return (
    <>
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
    </>
  );
};

export default PageButtons;
