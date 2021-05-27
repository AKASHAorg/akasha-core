import React from 'react';
import { Box } from 'grommet';

import { IFormValues, ProfileUpdateStatus } from '../';
import Button from '../../Button';
import Spinner from '../../Spinner';

export interface IActionButtonsSectionProps {
  cancelLabel?: string;
  saveLabel?: string;
  showUsername?: boolean;
  formChanged: boolean;
  isValidatingUsername?: boolean;
  usernameError?: string;
  formValues: IFormValues;
  updateStatus: ProfileUpdateStatus;
  handleRevert: () => void;
  handleSave: () => void;
}

const ActionButtonsSection: React.FC<IActionButtonsSectionProps> = props => {
  const {
    cancelLabel,
    saveLabel,
    showUsername,
    formChanged,
    isValidatingUsername,
    usernameError,
    formValues,
    updateStatus,
    handleRevert,
    handleSave,
  } = props;
  return (
    <Box direction="row" gap="xsmall" justify="end">
      {!showUsername && <Button label={cancelLabel} onClick={handleRevert} />}
      <Button
        label={updateStatus.saving ? <Spinner style={{ padding: 0 }} size={15} /> : saveLabel}
        onClick={handleSave}
        primary={true}
        disabled={
          !formChanged ||
          (!formValues.userName && showUsername) ||
          !formValues.name ||
          isValidatingUsername ||
          !!usernameError
        }
      />
    </Box>
  );
};

export { ActionButtonsSection };
