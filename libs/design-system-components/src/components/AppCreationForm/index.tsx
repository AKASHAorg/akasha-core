import React from 'react';
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

export enum FieldName {
  extensionType = 'extensionType',
  extensionID = 'extensionID',
  extensionName = 'extensionName',
}

type AppCreationFormValues = {
  extensionType: { id: string; type: AkashaAppApplicationType; title: string };
  extensionID: '';
  extensionName: '';
};

export type AppCreationFormProps = {
  defaultValues?: AppCreationFormValues;
  cancelButton: ButtonType;
  createButton: {
    label: string;
    loading?: boolean;
    handleClick: (data: AppCreationFormValues) => void;
  };
  errorMessage?: { fieldName: string; message: string };
};

const AppCreationForm: React.FC<AppCreationFormProps> = ({
  defaultValues = {
    extensionType: { id: '1', type: AkashaAppApplicationType.App, title: 'Application' },
    extensionID: '',
    extensionName: '',
  },
  cancelButton,
  createButton,
  errorMessage,
}) => {
  const {
    control,
    setError,
    clearErrors,
    handleSubmit,
    formState: { errors, isDirty, isValid },
  } = useForm<AppCreationFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  React.useEffect(() => {
    if (!!errorMessage) {
      setError(errorMessage.fieldName as FieldName, {
        type: 'custom',
        message: errorMessage.message,
      });
    }
  }, [errorMessage, errors]);

  const extensionTypes = [
    { id: '1', type: AkashaAppApplicationType.App, title: 'Application' },
    { id: '2', type: AkashaAppApplicationType.Other, title: 'Extension' },
    { id: '3', type: AkashaAppApplicationType.Widget, title: 'Widget' },
  ];

  const onSubmit = data => {
    if (isValid && isDirty) {
      createButton.handleClick(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={tw(apply`h-full`)}>
      <Stack direction="column" spacing="gap-y-4">
        <Stack padding="px-4 pb-16" spacing="gap-y-4">
          <Controller
            control={control}
            name={FieldName.extensionType}
            render={({ field: { name, value = extensionTypes[0], onChange, ref } }) => (
              <DropDown
                label="Extension Type"
                name={name}
                selected={value}
                menuItems={extensionTypes}
                setSelected={onChange}
                ref={ref}
                required={true}
                requiredFieldAsteriskColor="red-500"
              />
            )}
            defaultValue={extensionTypes[0]}
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.extensionID}
            render={({
              field: {
                name,
                value,
                onChange = () => {
                  clearErrors(FieldName.extensionID);
                },
                ref,
              },
              fieldState: { error },
            }) => (
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
                requiredFieldAsteriskColor="red-500"
              />
            )}
            defaultValue=""
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
                requiredFieldAsteriskColor="red-500"
              />
            )}
            defaultValue=""
          />
        </Stack>
        <Divider />
        <Stack direction="row" spacing="gap-x-2" customStyle="ml-auto mt-auto px-4">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button
            variant="primary"
            label={createButton.label}
            loading={createButton.loading}
            disabled={isValid ? !isDirty : true}
            onClick={handleSubmit(onSubmit)}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default AppCreationForm;

const schema = z.object({
  extensionID: z
    .string()
    .trim()
    .min(6, { message: 'Must be at least 6 characters' })
    .refine(
      value => /^[a-zA-Z0-9-_.]+$/.test(value),
      'ID should contain only alphabets, numbers or -_.',
    ),
  extensionType: z.object({ id: z.string(), type: z.string(), title: z.string() }).required(),
  extensionName: z.string().trim().min(4, { message: 'Must be at least 4 characters' }),
});
