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

export type EditProfileProps = {
  defaultValues?: EditProfileFormValues;
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (formValues: EditProfileFormValues) => void;
  };
} & Omit<GeneralProps, 'control' | 'onAvatarChange' | 'onCoverImageChange'> &
  Omit<SocialLinksProps, 'control' | 'onDeleteLink'>;

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
    handleSubmit,
    unregister,
    formState: { isDirty, isValid },
  } = useForm<EditProfileFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const onSave = (formValues: EditProfileFormValues) =>
    saveButton.handleClick({ ...formValues, links: formValues.links.filter(link => link) });

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
          control={control}
          onDeleteLink={index => {
            unregister(`links.${index}`);
          }}
        />
        <Stack spacing="gap-x-2" customStyle="ml-auto mt-auto">
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
            disabled={!isDirty || !isValid}
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
  links: z.array(
    z
      .string({ required_error: 'Url is required' })
      .url({
        message: `Hmm this doesn't look like a URL 🤔`,
      })
      .optional(),
  ),
});
