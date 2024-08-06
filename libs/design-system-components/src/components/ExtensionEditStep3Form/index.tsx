import React, { SyntheticEvent, useState } from 'react';
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
import { ButtonType } from '../types/common.types';
import { Licenses } from '../AppCreationForm';
import { ContactInfo } from './ContactInfo';
import { AkashaProfile, Image } from '@akashaorg/typings/lib/ui';
import { Collaborators } from './Collaborators';

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
  collaboratorsSearchPlaceholderLabel?: string;
  extensionContributorsLabel: string;
  contactInfoFieldLabel?: string;
  contactInfoDescriptionLabel?: string;
  contactInfoPlaceholderLabel?: string;
  addLabel?: string;
  defaultValues?: ExtensionEditStep3FormValues;
  handleGetContributors?: (query: string) => void;
  contributors?: AkashaProfile[];
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep3FormValues) => void;
  };
  errorMessage?: { fieldName: string; message: string };
  transformSource: (src: Image) => Image;
};

const ExtensionEditStep3Form: React.FC<ExtensionEditStep3FormProps> = props => {
  const {
    defaultValues = {
      license: '',
      licenseOther: '',
      contributors: [],
      contactInfo: [],
    },
    handleGetContributors,
    contributors,
    transformSource,
    cancelButton,
    nextButton,
    errorMessage,
    contactInfoFieldLabel,
    contactInfoDescriptionLabel,
    collaboratorsFieldLabel,
    collaboratorsDescriptionLabel,
    collaboratorsSearchPlaceholderLabel,
    extensionContributorsLabel,
    addLabel,
  } = props;

  const {
    control,
    setError,
    trigger,
    getValues,
    formState: { errors },
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

  const [addedContributors, setAddedContributors] = useState<AkashaProfile[]>([]);

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();
    formValues.contributors = addedContributors.map(profile => profile.did?.id);
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
          <Collaborators
            addedContributors={addedContributors}
            setAddedContributors={setAddedContributors}
            contributors={contributors}
            handleGetContributors={handleGetContributors}
            contributorsFieldLabel={collaboratorsFieldLabel}
            contributorsDescriptionLabel={collaboratorsDescriptionLabel}
            contributorsSearchPlaceholderLabel={collaboratorsSearchPlaceholderLabel}
            extensionContributorsLabel={extensionContributorsLabel}
            addButtonLabel={addLabel}
            transformSource={transformSource}
          />
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
  extensionLicense: z.object({ id: z.string(), type: z.string(), title: z.string() }).required(),
});
