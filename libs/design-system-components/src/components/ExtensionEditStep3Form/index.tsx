import React, { SyntheticEvent, useEffect, useState } from 'react';
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
import { AkashaProfile, Image } from '@akashaorg/typings/lib/ui';
import { Collaborators } from './Collaborators';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import AutoComplete from '@akashaorg/design-system-core/lib/components/AutoComplete';

const MAX_TAGS = 4;

const MIN_TAG_CHARACTERS = 3;

export enum FieldName {
  license = 'license',
  licenseOther = 'licenseOther',
  contributors = 'contributors',
  keywords = 'keywords',
}

export type ExtensionEditStep3FormValues = {
  license?: string;
  licenseOther?: string;
  contributors?: string[];
  contactInfo?: string[];
  keywords?: string[];
};

export type ExtensionEditStep3FormProps = {
  licenseFieldLabel?: string;
  licenseOtherPlaceholderLabel?: string;
  collaboratorsFieldLabel?: string;
  collaboratorsDescriptionLabel?: string;
  collaboratorsSearchPlaceholderLabel?: string;
  extensionContributorsLabel: string;
  addLabel?: string;
  tagsLabel?: string;
  tagsDescriptionLabel?: string;
  addTagsPlaceholderLabel?: string;
  tagsAddedLabel?: string;
  noteLabel?: string;
  noteDescriptionLabel?: string;
  defaultValues?: ExtensionEditStep3FormValues;
  handleGetFollowingProfiles?: (query: string) => void;
  followingProfiles?: AkashaProfile[];
  contributorsProfiles?: AkashaProfile[];
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep3FormValues) => void;
  };
  transformSource: (src: Image) => Image;
};

const ExtensionEditStep3Form: React.FC<ExtensionEditStep3FormProps> = props => {
  const {
    defaultValues = {
      license: '',
      licenseOther: '',
      contributors: [],
      contactInfo: [],
      keywords: [],
    },
    handleGetFollowingProfiles,
    followingProfiles,
    contributorsProfiles,
    transformSource,
    cancelButton,
    nextButton,
    licenseFieldLabel,
    licenseOtherPlaceholderLabel,
    collaboratorsFieldLabel,
    collaboratorsDescriptionLabel,
    collaboratorsSearchPlaceholderLabel,
    extensionContributorsLabel,
    addLabel,
    tagsLabel,
    addTagsPlaceholderLabel,
    tagsDescriptionLabel,
    tagsAddedLabel,
    noteLabel,
    noteDescriptionLabel,
  } = props;

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<Omit<ExtensionEditStep3FormValues, 'keywords'> & { keywords?: string | string[] }>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

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

  const [addedContributors, setAddedContributors] = useState<AkashaProfile[]>(
    contributorsProfiles || [],
  );

  useEffect(() => {
    setAddedContributors(contributorsProfiles);
  }, [contributorsProfiles]);

  const [keywords, setKeywords] = useState(new Set(defaultValues.keywords));

  const maxTagsSelected = keywords.size >= MAX_TAGS;

  //@TODO: here it should be a list of available indexed keywords for extensions
  const availableKeywords = [];

  const onSave = (event: SyntheticEvent) => {
    event.preventDefault();
    const formValues = getValues();

    if (formValues.license === Licenses.OTHER) {
      formValues.license = formValues.licenseOther;
    }

    if (isValid) {
      nextButton.handleClick({
        ...formValues,
        contributors: addedContributors?.map(profile => profile?.did?.id),
        keywords: [...keywords]?.filter(keyword => keyword),
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
            render={({ field: { name, value, onChange } }) => (
              <DropDown
                label={licenseFieldLabel}
                name={name}
                selected={value}
                menuItems={licenses}
                setSelected={onChange}
                required={true}
              />
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
                  placeholder={licenseOtherPlaceholderLabel}
                  type={'text'}
                  caption={error?.message}
                  status={error?.message ? 'error' : null}
                  onChange={onChange}
                  inputRef={ref}
                  required={true}
                />
              )}
              defaultValue={licenses.includes(defaultValues.license) ? '' : defaultValues.license}
            />
          )}
          <Divider />
          <Collaborators
            addedContributors={addedContributors}
            setAddedContributors={setAddedContributors}
            contributors={followingProfiles}
            handleGetContributors={handleGetFollowingProfiles}
            contributorsFieldLabel={collaboratorsFieldLabel}
            contributorsDescriptionLabel={collaboratorsDescriptionLabel}
            contributorsSearchPlaceholderLabel={collaboratorsSearchPlaceholderLabel}
            extensionContributorsLabel={extensionContributorsLabel}
            addButtonLabel={addLabel}
            transformSource={transformSource}
          />
          <Divider />

          <Stack direction="column" spacing="gap-2">
            <Text variant="h6">{tagsLabel}</Text>
            <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
              {tagsDescriptionLabel}
            </Text>
            <Controller
              control={control}
              name={FieldName.keywords}
              render={({ field: { value, onChange }, fieldState: { error } }) => {
                const errorMessage = error?.message ?? '';
                return (
                  <AutoComplete
                    value={typeof value === 'string' ? value : ''}
                    options={availableKeywords}
                    placeholder={addTagsPlaceholderLabel}
                    tags={keywords}
                    caption={errorMessage ? errorMessage : ''}
                    status={errorMessage ? 'error' : null}
                    separators={['Comma', 'Space', 'Enter']}
                    customStyle="grow mt-2"
                    onSelected={({ index }) => {
                      const newKeyWords = keywords.add(availableKeywords[index]);
                      onChange([...newKeyWords]);
                      setKeywords(newKeyWords);
                    }}
                    onChange={value => {
                      onChange(value);
                      if (Array.isArray(value)) {
                        if (!errorMessage) setKeywords(new Set(value));
                      }
                    }}
                    disabled={maxTagsSelected}
                    multiple
                  />
                );
              }}
            />

            <Text variant="subtitle2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
              {`${keywords.size}/${MAX_TAGS} ${tagsAddedLabel}`}
            </Text>
          </Stack>
          <Divider />
          <Stack direction="column" spacing="gap-2">
            <Stack direction="row" align="center" spacing="gap-x-1">
              <Icon
                icon={<ExclamationTriangleIcon />}
                size="sm"
                color={{ light: 'warningLight', dark: 'warningDark' }}
              />
              <Text variant="button-md">{noteLabel}</Text>
            </Stack>
            <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
              {noteDescriptionLabel}
            </Text>
          </Stack>
        </Stack>
        <Divider />

        <Stack direction="row" justify="end" spacing="gap-x-2" customStyle="px-4 pb-4">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button variant="primary" label={nextButton.label} disabled={!isValid} onClick={onSave} />
        </Stack>
      </Stack>
    </form>
  );
};

export default ExtensionEditStep3Form;

const schema = z.object({
  extensionLicense: z.string(),
  keywords: z
    .array(z.string())
    .optional()
    .or(
      z
        .string()
        .min(MIN_TAG_CHARACTERS, {
          message: `Tags must be at least ${MIN_TAG_CHARACTERS} characters long.`,
        })
        .or(z.literal('')),
    ),
});
