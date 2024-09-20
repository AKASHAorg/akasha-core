import React, { SyntheticEvent } from 'react';
import * as z from 'zod';
import { Controller } from 'react-hook-form';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import { apply, tw } from '@twind/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '../types/common.types';

export enum FieldName {
  versionNumber = 'versionNumber',
  description = 'description',
  sourceURL = 'sourceURL',
}

export type ExtensionReleaseSubmitValues = {
  versionNumber?: string;
  description?: string;
  sourceURL?: string;
};

export type ExtensionReleaseSubmitProps = {
  defaultValues?: ExtensionReleaseSubmitValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionReleaseSubmitValues) => void;
  };
  versionNumberLabel?: string;
  descriptionFieldLabel?: string;
  descriptionPlaceholderLabel?: string;
  sourceURLFieldLabel?: string;
  sourceURLPlaceholderLabel?: string;
  loading?: boolean;
};

const ExtensionReleaseSubmit: React.FC<ExtensionReleaseSubmitProps> = props => {
  const {
    defaultValues = {
      versionNumber: '',
      description: '',
      sourceURL: '',
    },
    cancelButton,
    nextButton,
    versionNumberLabel,
    descriptionFieldLabel,
    descriptionPlaceholderLabel,
    sourceURLFieldLabel,
    sourceURLPlaceholderLabel,
    loading,
  } = props;

  const {
    control,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ExtensionReleaseSubmitValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const isFormDirty =
    Object.keys(dirtyFields).includes(FieldName.versionNumber) &&
    Object.keys(dirtyFields).includes(FieldName.description) &&
    Object.keys(dirtyFields).includes(FieldName.sourceURL);

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

  return (
    <form onSubmit={onSave} className={tw(apply`h-full`)}>
      <Stack direction="column" spacing="gap-y-4">
        <Stack padding="px-4 pb-16" spacing="gap-y-4">
          <Controller
            control={control}
            name={FieldName.versionNumber}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                id={name}
                type="text"
                name={name}
                label={versionNumberLabel}
                placeholder="e.g. 1.0.0"
                value={value}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
                required={true}
              />
            )}
            defaultValue={defaultValues.versionNumber}
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.description}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                id={name}
                name={name}
                label={descriptionFieldLabel}
                placeholder={descriptionPlaceholderLabel}
                value={value}
                onChange={onChange}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                inputRef={ref}
                type="multiline"
                maxLength={2000}
                required={true}
              />
            )}
            defaultValue={defaultValues.description}
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.sourceURL}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                id={name}
                type="text"
                name={name}
                label={sourceURLFieldLabel}
                placeholder={sourceURLPlaceholderLabel}
                value={value}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
                required={true}
              />
            )}
            defaultValue={defaultValues.sourceURL}
          />
        </Stack>
        <Divider />

        <Stack direction="row" justify="end" spacing="gap-x-2" customStyle="px-4 pb-4">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button
            variant="primary"
            loading={loading}
            label={nextButton.label}
            disabled={!isValid || !isFormDirty}
            onClick={onSave}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default ExtensionReleaseSubmit;

const schema = z.object({
  versionNumber: z.string(),
  description: z
    .string()
    .trim()
    .min(10, { message: 'Must be at least 10 characters' })
    .max(2000, { message: 'Must be less than 2000 characters' }),
  sourceURL: z.string().url({ message: 'URL is required' }),
});
