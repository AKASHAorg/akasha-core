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
import {
  AkashaAppApplicationType,
  AppProviderValue,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { ButtonType } from '../types/common.types';
import { Licenses } from '../AppCreationForm';
import { ContactInfo } from './ContactInfo';

export enum FieldName {
  license = 'license',
  licenseOther = 'licenseOther',
  contributors = 'contributors',
  contactInfo = 'contactInfo',
}

export type ExtensionEditStep3FormValues = {
  license?: string;
  licenseOther?: string;
  contributors?: string[];
  contactInfo?: string[];
};

export type ExtensionEditStep3FormProps = {
  licenseFieldLabel?: string;
  collaboratorsFieldLabel?: string;
  collaboratorsDescriptionLabel?: string;
  contactInfoFieldLabel?: string;
  contactInfoDescriptionLabel?: string;
  contactInfoPlaceholderLabel?: string;
  addLabel?: string;
  defaultValues?: ExtensionEditStep3FormValues;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep3FormValues) => void;
  };
  errorMessage?: { fieldName: string; message: string };
};

const ExtensionEditStep3Form: React.FC<ExtensionEditStep3FormProps> = props => {
  const {
    defaultValues = {
      license: '',
      licenseOther: '',
      contributors: [],
      contactInfo: [],
    },
    cancelButton,
    nextButton,
    errorMessage,
    contactInfoFieldLabel,
    contactInfoDescriptionLabel,
    contactInfoPlaceholderLabel,
    addLabel,
  } = props;

  const {
    control,
    setError,
    trigger,
    getValues,
    formState: { errors, dirtyFields },
  } = useForm<ExtensionEditStep3FormValues>({
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

  const licenses: Licenses | string[] = [
    Licenses.MIT,
    Licenses.GPL,
    Licenses.APACHE,
    Licenses.BSD,
    Licenses.MPL,
    Licenses.OTHER,
  ];

  const isValid = !Object.keys(errors).length;

  const licenseValue = useWatch({ control, name: FieldName.license });

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();

    if (formValues.license === Licenses.OTHER) {
      formValues.license = formValues.licenseOther;
    }
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
            name={FieldName.license}
            render={({ field: { name, value, onChange, ref } }) => (
              <>
                <DropDown
                  label="License"
                  name={name}
                  selected={value}
                  menuItems={licenses}
                  setSelected={onChange}
                  ref={ref}
                  required={true}
                  requiredFieldAsteriskColor={{ light: 'errorLight', dark: 'errorDark' }}
                />
              </>
            )}
            defaultValue={
              licenses.includes(defaultValues.license) ? defaultValues.license : Licenses.OTHER
            }
          />
          {licenseValue === Licenses.OTHER && (
            <Controller
              control={control}
              name={FieldName.licenseOther}
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
              defaultValue={defaultValues.license}
            />
          )}
          <Divider />
          <ContactInfo
            contactLabel={contactInfoFieldLabel}
            description={contactInfoDescriptionLabel}
            addButtonLabel={addLabel}
            control={control}
            contactInfo={defaultValues.contactInfo}
            onDeleteInfoField={async () => {
              await trigger();
            }}
          />
          <Divider />
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

export default ExtensionEditStep3Form;

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
