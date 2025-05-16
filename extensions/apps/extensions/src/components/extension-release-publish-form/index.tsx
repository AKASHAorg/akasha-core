import React, { SyntheticEvent, useState } from 'react';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
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
export enum FieldName {
  versionNumber = 'versionNumber',
  description = 'description',
  sourceURL = 'sourceURL',
}
export type ExtensionReleasePublishValues = {
  versionNumber?: string;
  description?: string;
  sourceURL?: string;
};
export type ExtensionReleasePublishProps = {
  versionNumberLabel: string;
  descriptionFieldLabel: string;
  descriptionPlaceholderLabel: string;
  sourceURLFieldLabel: string;
  sourceURLPlaceholderLabel?: string;
  confirmationModalTitleLabel?: string;
  confirmationModalDescriptionLabel?: string;
  cancelLabel?: string;
  confirmLabel?: string;
  validationLabels: {
    version: string;
    descriptionMin: string;
    descriptionMax: string;
    sourceURL: string;
  };
  defaultValues?: ExtensionReleasePublishValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionReleasePublishValues) => void;
  };
  loading?: boolean;
  requireVersionNumber?: boolean;
  requireDescription?: boolean;
  showModalFlow?: boolean;
};
const ExtensionReleasePublish: React.FC<ExtensionReleasePublishProps> = props => {
  const {
    defaultValues = {
      versionNumber: '',
      description: '',
      sourceURL: '',
    },
    validationLabels,
    cancelButton,
    nextButton,
    versionNumberLabel,
    descriptionFieldLabel,
    descriptionPlaceholderLabel,
    sourceURLFieldLabel,
    sourceURLPlaceholderLabel,
    loading,
    requireVersionNumber,
    requireDescription,
    confirmationModalTitleLabel,
    confirmationModalDescriptionLabel,
    confirmLabel,
    cancelLabel,
    showModalFlow,
  } = props;
  const schema = z.object({
    versionNumber: z
      .string()
      .refine(
        value =>
          /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/.test(
            value ?? '',
          ),
        validationLabels.version,
      ),
    description: z
      .string()
      .trim()
      .min(10, {
        message: validationLabels.descriptionMin,
      })
      .max(2000, {
        message: validationLabels.descriptionMax,
      }),
    sourceURL: z.string().url({
      message: validationLabels.sourceURL,
    }),
  });
  const form = useForm<ExtensionReleasePublishValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const {
    control,
    getValues,
    formState: { errors, dirtyFields },
  } = form;
  const isFormDirty = Object.keys(dirtyFields).includes(FieldName.sourceURL);
  const isValid = !Object.keys(errors).length;
  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (isValid && isFormDirty) {
      nextButton.handleClick({
        ...formValues,
      });
    }
  };
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const onConfirmationModalClose = () => {
    setShowConfirmationModal(false);
  };
  const onConfirmationModalOpen = () => {
    setShowConfirmationModal(true);
  };
  const handleSave = ev => {
    onConfirmationModalClose();
    onSave(ev);
  };
  return (
    <Form {...form}>
      <form className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack spacing={4} className="px-4 pb-16">
            <FormField
              control={control}
              name={FieldName.versionNumber}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{versionNumberLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={'e.g. 1.0.0'}
                      {...field}
                      onChange={field.onChange}
                      required={requireVersionNumber}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.versionNumber}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{descriptionFieldLabel}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={descriptionPlaceholderLabel}
                      {...field}
                      onChange={field.onChange}
                      maxLength={2000}
                      required={requireDescription}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.description}
            />
            <Separator />
            <FormField
              control={control}
              name={FieldName.sourceURL}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{sourceURLFieldLabel}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={sourceURLPlaceholderLabel}
                      {...field}
                      onChange={field.onChange}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.sourceURL}
            />
          </Stack>
          <Separator />

          <Stack direction="row" justifyContent="end" spacing={2} className="px-4 pb-4">
            <Button
              variant="link"
              onClick={cancelButton.handleClick}
              disabled={cancelButton.disabled}
            >
              {cancelButton.label}
            </Button>
            <Button
              loading={loading}
              disabled={!isValid || !isFormDirty}
              onClick={showModalFlow ? onConfirmationModalOpen : onSave}
            >
              {nextButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
      <AlertDialog open={showConfirmationModal} onOpenChange={onConfirmationModalClose}>
        <AlertDialogContent className="max-w-[615px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{confirmationModalTitleLabel}</AlertDialogTitle>
            <AlertDialogDescription>
              <Typography>{confirmationModalDescriptionLabel}</Typography>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onConfirmationModalClose}>{cancelLabel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>{confirmLabel}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Form>
  );
};
export default ExtensionReleasePublish;
