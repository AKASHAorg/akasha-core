import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@akashaorg/ui/lib/components/alert-dialog';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
type DeleteImageModalProps = {
  title: { label: string };
  show: boolean;
  cancelLabel: string;
  deleteLabel: string;
  confirmationLabel: string;
  onDelete: () => void;
  onClose: () => void;
};
export const DeleteImageModal: React.FC<DeleteImageModalProps> = ({
  show,
  title,
  cancelLabel,
  deleteLabel,
  confirmationLabel,
  onDelete,
  onClose,
}) => {
  return (
    <AlertDialog open={show} onOpenChange={onClose}>
      <AlertDialogContent className="min-w-[20rem] sm:min-w-[38rem]">
        <AlertDialogHeader>
          <AlertDialogTitle>{title.label}</AlertDialogTitle>
          <AlertDialogDescription>
            <Typography>{confirmationLabel}</Typography>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>{cancelLabel}</AlertDialogCancel>
          <AlertDialogAction onClick={onDelete}>{deleteLabel}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
