import React, { SyntheticEvent } from 'react';
import * as z from 'zod';
import { Controller, useWatch } from 'react-hook-form';
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
  extensionLicense = 'extensionLicense',
  extensionLicenseOther = 'extensionLicenseOther',
}

export enum Licenses {
  MIT = 'MIT',
  GPL = 'GNU General Public License',
  APACHE = 'Apache License 2.0',
  BSD = 'BSD',
  MPL = 'MPL 2.0',
  OTHER = 'Other',
}

type AppCreationFormValues = {
  extensionType: { id: string; type: AkashaAppApplicationType; title: string };
  extensionID: string;
  extensionName: string;
  extensionLicense: { id: string; type: Licenses; title: string };
  extensionLicenseOther: string;
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
    extensionLicense: { id: '1', type: Licenses.MIT, title: Licenses.MIT },
    extensionLicenseOther: '',
  },
  cancelButton,
  createButton,
  errorMessage,
}) => {
  const {
    control,
    setError,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<AppCreationFormValues>({
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

  const extensionLicenseValue = useWatch({ control, name: FieldName.extensionLicense });

  const extensionTypes = [
    { id: '1', type: AkashaAppApplicationType.App, title: AkashaAppApplicationType.App },
    { id: '2', type: AkashaAppApplicationType.Plugin, title: AkashaAppApplicationType.Plugin },
    { id: '3', type: AkashaAppApplicationType.Widget, title: AkashaAppApplicationType.Widget },
  ];

  const extensionLicenses = [
    { id: '1', type: Licenses.MIT, title: Licenses.MIT },
    { id: '2', type: Licenses.GPL, title: Licenses.GPL },
    { id: '3', type: Licenses.APACHE, title: Licenses.APACHE },
    { id: '4', type: Licenses.BSD, title: Licenses.BSD },
    { id: '5', type: Licenses.MPL, title: Licenses.MPL },
    { id: '6', type: Licenses.OTHER, title: Licenses.OTHER },
  ];

  const isFormDirty =
    Object.keys(dirtyFields).includes(FieldName.extensionID) &&
    Object.keys(dirtyFields).includes(FieldName.extensionName);
  const isValid = !Object.keys(errors).length;

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    if (formValues.extensionLicense.type === Licenses.OTHER) {
      formValues.extensionLicense.title = formValues.extensionLicenseOther;
    }
    if (isValid && isFormDirty) {
      createButton.handleClick({
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
            defaultValue={extensionTypes[0]}
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
                requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
              />
            )}
            defaultValue=""
          />
          <Divider />
          <Controller
            control={control}
            name={FieldName.extensionLicense}
            render={({ field: { name, value, onChange, ref } }) => (
              <>
                <DropDown
                  label="Extension License"
                  name={name}
                  selected={value}
                  menuItems={extensionLicenses}
                  setSelected={onChange}
                  ref={ref}
                  required={true}
                  requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
                />
              </>
            )}
            defaultValue={extensionLicenses[0]}
          />
          {extensionLicenseValue.type === Licenses.OTHER && (
            <Controller
              control={control}
              name={FieldName.extensionLicenseOther}
              render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
                <TextField
                  id={name}
                  customStyle="mt-2"
                  value={value}
                  placeholder={'Please specify your license type'}
                  type={'text'}
                  caption={error?.message}
                  status={error?.message ? 'error' : null}
                  onChange={onChange}
                  inputRef={ref}
                  required={true}
                  requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
                />
              )}
              defaultValue=""
            />
          )}
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
            disabled={isValid ? !isFormDirty : true}
            onClick={onSave}
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
  extensionLicense: z.object({ id: z.string(), type: z.string(), title: z.string() }).required(),
  extensionLicenseOther: z.string().trim().min(3, { message: 'Must be at least 3 characters' }),
});
