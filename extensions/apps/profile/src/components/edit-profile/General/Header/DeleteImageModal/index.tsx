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
      <AlertDialogContent className="min-w-[20rem] sm:min-w-[38rem] sm:rounded-3xl border-none bg-card">
        <AlertDialogHeader className="sm:text-center">
          <AlertDialogTitle>{title.label}</AlertDialogTitle>
          <AlertDialogDescription>
            <Typography>{confirmationLabel}</Typography>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="sm:justify-center">
          <Button variant="outline" onClick={onClose}>
            {cancelLabel}
          </Button>
          <Button onClick={onDelete}>{deleteLabel}</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
