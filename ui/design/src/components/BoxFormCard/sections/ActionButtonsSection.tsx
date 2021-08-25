import React from 'react';
import { Box } from 'grommet';

import { IFormValues } from '../';
import Button from '../../Button';
import Spinner from '../../Spinner';
import { UpdateProfileStatus } from '@akashaproject/ui-awf-typings/lib/profile';

export interface IActionButtonsSectionProps {
  cancelLabel?: string;
  saveLabel?: string;
  showUsername?: boolean;
  formChanged: boolean;
  isValidatingUsername?: boolean;
  usernameError?: string;
  formValues: IFormValues;
  updateStatus: UpdateProfileStatus;
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
      {!showUsername && (
        <Button
          label={cancelLabel}
          disabled={updateStatus > UpdateProfileStatus.UPDATE_IDLE}
          onClick={handleRevert}
        />
      )}
      <Button
        label={
          updateStatus > UpdateProfileStatus.UPDATE_IDLE ? (
            <Spinner style={{ padding: 0 }} size={15} />
          ) : (
            saveLabel
          )
        }
        onClick={handleSave}
        primary={true}
        disabled={
          !formChanged ||
          (!formValues.userName && showUsername) ||
          !formValues.name ||
          isValidatingUsername ||
          !!usernameError ||
          updateStatus > UpdateProfileStatus.UPDATE_IDLE
        }
      />
    </Box>
  );
};

export { ActionButtonsSection };
