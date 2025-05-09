import React, { SyntheticEvent, useEffect, useMemo, useState } from 'react';
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
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { StackedAvatar } from '@akashaorg/ui/lib/akasha-components/stacked-avatar';
import {
  ProfileAvatar,
  ProfileAvatarFallback,
  ProfileAvatarImage,
} from '@akashaorg/ui/lib/akasha-components/profile-avatar';
import { Loader2 } from 'lucide-react';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';
import { Licenses } from '../extension-creation-form';
import { AkashaProfile, Image } from '@akashaorg/typings/lib/ui';
import { PlusIcon, TriangleAlertIcon } from 'lucide-react';
import { ApolloError } from '@apollo/client';
import Label from '@akashaorg/design-system-core/lib/components/Label';
import {
  ErrorLoader,
  ErrorLoaderDescription,
  ErrorLoaderTitle,
} from '@akashaorg/ui/lib/akasha-components/error-loader';
import {
  TagsInput,
  TagsInputItem,
  TagsInputList,
} from '@akashaorg/ui/lib/akasha-components/tags-input';

const MAX_TAGS = 4;
const MIN_TAG_CHARACTERS = 3;
export enum FieldName {
  license = 'license',
  licenseOther = 'licenseOther',
  keywords = 'keywords',
}
export type ExtensionEditStep3FormValues = {
  license?: string;
  licenseOther?: string;
  contactInfo?: string[];
  keywords?: string[];
};
export type ExtensionEditStep3FormProps = {
  licenseFieldLabel?: string;
  licenseOtherPlaceholderLabel?: string;
  collaboratorsFieldLabel?: string;
  collaboratorsDescriptionLabel?: string;
  moreLabel?: string;
  addLabel?: string;
  addAndEditLabel?: string;
  tagsLabel?: string;
  tagsDescriptionLabel?: string;
  addTagsPlaceholderLabel?: string;
  tagsAddedLabel?: string;
  noteLabel?: string;
  noteDescriptionLabel?: string;
  errorProfilesDataLabel?: string;
  defaultValues?: ExtensionEditStep3FormValues;
  contributorsProfiles?: AkashaProfile[];
  errorProfilesData?: ApolloError;
  loadingProfilesData?: boolean;
  maxContributorsDisplay: number;
  cancelButton: ButtonType;
  nextButton: {
    label: string;
    handleClick: (data: ExtensionEditStep3FormValues) => void;
  };
  handleNavigateToContributorsPage?: (data: ExtensionEditStep3FormValues) => void;
  transformSource: (src: Image) => Image;
};
const ExtensionEditStep3Form: React.FC<ExtensionEditStep3FormProps> = props => {
  const {
    defaultValues = {
      license: '',
      licenseOther: '',
      contactInfo: [],
      keywords: [],
    },
    contributorsProfiles,
    loadingProfilesData,
    errorProfilesData,
    cancelButton,
    nextButton,
    handleNavigateToContributorsPage,
    transformSource,
    licenseFieldLabel,
    licenseOtherPlaceholderLabel,
    collaboratorsFieldLabel,
    collaboratorsDescriptionLabel,
    moreLabel,
    addLabel,
    addAndEditLabel,
    tagsLabel,
    addTagsPlaceholderLabel,
    tagsDescriptionLabel,
    tagsAddedLabel,
    noteLabel,
    noteDescriptionLabel,
    errorProfilesDataLabel,
  } = props;
  const form = useForm<
    Omit<ExtensionEditStep3FormValues, 'keywords'> & {
      keywords?: string | string[];
    }
  >({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const {
    control,
    getValues,
    setValue,
    formState: { errors },
  } = form;
  const licenses: Licenses | string[] = useMemo(
    () => [Licenses.MIT, Licenses.GPL, Licenses.APACHE, Licenses.BSD, Licenses.MPL, Licenses.OTHER],
    [],
  );
  const isValid = !Object.keys(errors).length;
  const licenseValue = useWatch({
    control,
    name: FieldName.license,
  });
  useEffect(() => {
    if (!licenses.includes(defaultValues.license)) {
      setValue('license', Licenses.OTHER);
    }
  }, [licenses, defaultValues.license, setValue]);
  const [keywords, setKeywords] = useState(new Set(defaultValues.keywords));
  const maxTagsSelected = keywords.size >= MAX_TAGS;
  const contributorAvatars = useMemo(() => {
    if (contributorsProfiles?.length) {
      return contributorsProfiles
        .filter(contrib => !!contrib)
        .map(contrib => {
          return {
            ...contrib,
            avatar: transformSource(contrib.avatar?.default),
          };
        });
    }
  }, [contributorsProfiles, transformSource]);

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
        keywords: [...keywords]?.filter(keyword => keyword),
      });
    }
  };
  const handleAddContributors = () => {
    const formValues = getValues();
    if (formValues.license === Licenses.OTHER) {
      formValues.license = formValues.licenseOther;
    }
    if (isValid) {
      handleNavigateToContributorsPage({
        ...formValues,
        keywords: [...keywords]?.filter(keyword => keyword),
      });
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={onSave} className={`h-full`}>
        <Stack direction="column" spacing={4}>
          <Stack spacing={4} className="px-4 pb-16">
            <FormField
              control={control}
              name={FieldName.license}
              render={({ field: { name, value, onChange } }) => (
                <FormItem>
                  <FormLabel>{licenseFieldLabel}</FormLabel>
                  <FormControl>
                    <DropDown
                      label={licenseFieldLabel}
                      name={name}
                      selected={value}
                      menuItems={licenses}
                      setSelected={onChange}
                      required={true}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              defaultValue={defaultValues.license}
            />
            {licenseValue === Licenses.OTHER && (
              <FormField
                control={control}
                name={FieldName.licenseOther}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder={licenseOtherPlaceholderLabel}
                        {...field}
                        onChange={field.onChange}
                        required={true}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                defaultValue={licenses.includes(defaultValues.license) ? '' : defaultValues.license}
              />
            )}
            <Divider />
            <Stack direction="column" spacing={4}>
              <Stack spacing={1} direction="column">
                <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
                  <Typography variant="h6">{collaboratorsFieldLabel}</Typography>
                  <Button variant="link" onClick={handleAddContributors}>
                    <PlusIcon />
                    {contributorsProfiles.length > 0 ? addAndEditLabel : addLabel}
                  </Button>
                </Stack>
                <Typography variant="sm" className="text-grey4 dark:text-grey6 font-light">
                  {collaboratorsDescriptionLabel}
                </Typography>
              </Stack>
              {loadingProfilesData && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
              {errorProfilesData && (
                <Stack>
                  <ErrorLoader type="script-error">
                    <ErrorLoaderTitle>{errorProfilesDataLabel}</ErrorLoaderTitle>
                    <ErrorLoaderDescription>{errorProfilesData.message}</ErrorLoaderDescription>
                  </ErrorLoader>
                </Stack>
              )}
              {contributorAvatars?.length > 0 && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <StackedAvatar count={contributorAvatars.length}>
                    {index => (
                      <ProfileAvatar>
                        <ProfileAvatarImage
                          src={contributorAvatars[index].avatar?.src}
                          alt={contributorAvatars[index].name}
                        />
                        <ProfileAvatarFallback />
                      </ProfileAvatar>
                    )}
                  </StackedAvatar>
                  <Stack alignItems="center" justifyContent="center">
                    <Typography variant="sm" bold>
                      {contributorsProfiles[0]?.name}
                    </Typography>
                    {contributorsProfiles.length > 1 && (
                      <Typography
                        variant="xs"
                        className="font-medium text-grey4 dark:text-grey6 font-light"
                      >{`and ${contributorsProfiles.length - 1} ${moreLabel}`}</Typography>
                    )}
                  </Stack>
                </Stack>
              )}
            </Stack>

            <Divider />

            <Stack direction="column" spacing={2}>
              <Label required={true}>{tagsLabel}</Label>
              <Typography variant="sm" className="font-light text-grey4 dark:text-grey6 font-light">
                {tagsDescriptionLabel}
              </Typography>
              <FormField
                control={control}
                name={FieldName.keywords}
                render={({ field: { onChange } }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <TagsInput
                          className="mt-1.5"
                          disabled={maxTagsSelected}
                          placeholder={addTagsPlaceholderLabel}
                          separators={['Comma', 'Space', 'Enter']}
                          onTagsChange={value => {
                            setKeywords(value);
                          }}
                          onChange={onChange}
                        >
                          <TagsInputList>
                            {keywords &&
                              Array.from(keywords).map(tag => (
                                <TagsInputItem key={tag} tag={tag} />
                              ))}
                          </TagsInputList>
                        </TagsInput>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <Typography variant="sm" className="font-light text-grey4 dark:text-grey6 font-light">
                {`${keywords.size}/${MAX_TAGS} ${tagsAddedLabel}`}
              </Typography>
            </Stack>
            <Divider />
            <Stack direction="column" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <TriangleAlertIcon className="h-4 w-4 [&>*]:stroke-warningLight dark:[&>*]:stroke-warningDark" />
                <Typography variant="sm" bold>
                  {noteLabel}
                </Typography>
              </Stack>
              <Typography variant="sm" className="text-grey4 dark:text-grey6 font-light">
                {noteDescriptionLabel}
              </Typography>
            </Stack>
          </Stack>
          <Divider />

          <Stack direction="row" justifyContent="end" spacing={2} className="px-4 pb-4">
            <Button
              variant="link"
              onClick={cancelButton.handleClick}
              disabled={cancelButton.disabled}
            >
              {cancelButton.label}
            </Button>
            <Button disabled={!isValid} onClick={onSave} type="submit">
              {nextButton.label}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Form>
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
