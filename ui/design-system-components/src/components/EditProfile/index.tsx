import React from 'react';
import * as z from 'zod';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { SocialLinks, SocialLinksProps } from './SocialLinks';
import { apply, tw } from '@twind/core';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { General, GeneralProps } from './General';
import { EditProfileFormValues } from './types';
import { ButtonType } from '../types/common.types';

type SocialLinkForm = Pick<
  SocialLinksProps,
  'socialLinks' | 'linkLabel' | 'addNewLinkButtonLabel' | 'description'
>;

type GeneralForm = Pick<GeneralProps, 'header' | 'name' | 'userName' | 'bio'>;

//@TODO: Replace react-hook-form with better architected react form library.
export type EditProfileProps = {
  defaultValues?: EditProfileFormValues;
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (formValues: EditProfileFormValues) => void;
  };
  customStyle?: string;
} & GeneralForm &
  SocialLinkForm;

const EditProfile: React.FC<EditProfileProps> = ({
  defaultValues = {
    avatar: null,
    coverImage: null,
    name: '',
    bio: '',
    ens: '',
    userName: '',
    links: [],
  },
  cancelButton,
  saveButton,
  customStyle = '',
  ...rest
}) => {
  const {
    control,
    setValue,
    getValues,
    resetField,
    handleSubmit,
    trigger,
    formState: { isDirty, isValid },
  } = useForm<EditProfileFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSave = (formValues: EditProfileFormValues) =>
    saveButton.handleClick({ ...formValues, links: formValues.links?.filter(link => link) || [] });

  const isFormDirty = () => {
    const links = getValues('links')?.filter(link => link) || [];
    //Compute isDirty for links accurately
    if (links.length !== defaultValues.links?.length) {
      return true;
    }

    return isDirty;
  };

  return (
    <form onSubmit={handleSubmit(onSave)} className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" spacing="gap-y-4">
        <General
          {...rest}
          control={control}
          onAvatarChange={avatar => {
            setValue('avatar', avatar);
          }}
          onCoverImageChange={coverImage => {
            setValue('coverImage', coverImage);
          }}
        />
        <SocialLinks
          {...rest}
          onDeleteLink={async () => {
            //compute form state accurately as a result of the following function calls ... react-hook-form is very bad at handling the state for unregistered component
            resetField('links');
            await trigger();
          }}
          control={control}
        />
        <Stack direction="row" spacing="gap-x-2" customStyle="ml-auto mt-auto">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button
            variant="primary"
            label={saveButton.label}
            loading={saveButton.loading}
            disabled={isValid ? !isFormDirty() : true}
            onClick={handleSubmit(onSave)}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

export default EditProfile;

const schema = z.object({
  name: z
    .string()
    .trim()
    .min(3, { message: 'Must be at least 3 characters' })
    .refine(
      value => /^[a-zA-Z0-9-_.]+$/.test(value),
      'Name should contain only alphabets, numbers or -_.',
    ),
  userName: z.string().optional(),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
  ens: z.string().optional(),
  bio: z.string().optional(),
  links: z
    .array(
      z
        .string()
        .url({
          message: `Hmm this doesn't look like a URL 🤔`,
        })
        .optional(),
    )
    .optional(),
});
