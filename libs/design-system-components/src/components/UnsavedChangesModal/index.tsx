import React from 'react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
export type UnsavedChangesModalProps = {
  showModal: boolean;
  cancelButtonLabel: string;
  leavePageButtonLabel: string;
  title: string;
  description: string;
  handleModalClose: () => void;
  handleLeavePage: () => void;
};

/**
 * The UnsavedChangesModal composes the Modal component and is used to prompt user of any unsaved changes before navigating away from a page.
 * It is currently implemented in:
 * - edit profile page
 * - beam editor page
 * - edit profile interests page
 */
const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = props => {
  const {
    showModal,
    cancelButtonLabel,
    leavePageButtonLabel,
    title,
    description,
    handleModalClose,
    handleLeavePage,
  } = props;
  return (
    <AlertDialog open={showModal} onOpenChange={handleModalClose}>
      <AlertDialogContent className="py-4 px-6 md:px-24 sm:rounded-3xl border-none bg-card">
        <AlertDialogHeader className="sm:text-center">
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            <Typography className="font-light">{description}</Typography>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={handleModalClose}>
            {cancelButtonLabel}
          </Button>
          <Button onClick={handleLeavePage}>{leavePageButtonLabel}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default UnsavedChangesModal;
