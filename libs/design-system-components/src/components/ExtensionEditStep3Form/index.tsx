import React, { SyntheticEvent } from 'react';
import * as z from 'zod';
import { Controller } from 'react-hook-form';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { apply, tw } from '@twind/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ButtonType } from '../types/common.types';
import { Image } from '@akashaorg/typings/lib/ui';

export enum FieldName {
  extensionType = 'extensionType',
  extensionID = 'extensionID',
  extensionName = 'extensionName',
  logoImage = 'logoImage',
  coverImage = 'coverImage',
}

type ExtensionEditStep1FormValues = {
  logoImage?: Image | File | null;
  coverImage?: Image | File | null;
  extensionType?: AkashaAppApplicationType;
  extensionID?: string;
  extensionName?: string;
};

export type ExtensionEditStep1FormProps = {
  defaultValues?: ExtensionEditStep1FormValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep1FormValues) => void;
  };
  errorMessage?: { fieldName: string; message: string };
};

const ExtensionEditStep1Form: React.FC<ExtensionEditStep1FormProps> = props => {
  const {
    defaultValues = {
      extensionType: AkashaAppApplicationType.App,
      extensionID: '',
      extensionName: '',
      logoImage: null,
      coverImage: null,
    },
    cancelButton,
    nextButton,
    errorMessage,
  } = props;

  const {
    control,
    setError,
    setValue,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ExtensionEditStep1FormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (errorMessage) {
      setError(errorMessage.fieldName as FieldName, {
        type: 'custom',
        message: errorMessage.message,
      });
    }
  }, [errorMessage, errors]);

  const extensionTypes = [
    AkashaAppApplicationType.App,
    AkashaAppApplicationType.Plugin,
    AkashaAppApplicationType.Widget,
  ];

  const isFormDirty =
    Object.keys(dirtyFields).includes(FieldName.extensionID) &&
    Object.keys(dirtyFields).includes(FieldName.extensionName);
  const isValid = !Object.keys(errors).length;

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (isValid) {
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
            name={FieldName.extensionType}
            render={({ field: { name, value, onChange, ref } }) => (
              <DropDown
                label="Extension Type"
                name={name}
                selected={value}
                menuItems={extensionTypes}
                setSelected={onChange}
                ref={ref}
                required={true}
                requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
              />
            )}
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.extensionID}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                id={name}
                type="text"
                name={name}
                label={'Extension ID'}
                placeholder="unique extension identifier"
                value={value}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
                required={true}
                requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
              />
            )}
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.extensionName}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                id={name}
                type="text"
                name={name}
                label={'Extension Display Name'}
                placeholder="extension x"
                value={value}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
                required={true}
                requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
              />
            )}
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
            label={nextButton.label}
            disabled={!isValid}
            onClick={onSave}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default ExtensionEditStep1Form;

const schema = z.object({
  extensionID: z
    .string()
    .trim()
    .min(6, { message: 'Must be at least 6 characters' })
    .refine(
      value => /^[a-zA-Z0-9-_.]+$/.test(value),
      'ID should contain only alphabets, numbers or -_.',
    ),
  extensionType: z.string(),
  extensionName: z.string().trim().min(4, { message: 'Must be at least 4 characters' }).optional(),
  logoImage: z.any().optional(),
  coverImage: z.any().optional(),
});
