import React, { useEffect } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { tw, apply } from '@twind/core';
import { Header, HeaderProps } from './Header';
import { useForm, Controller } from 'react-hook-form';
import { useMedia } from 'react-use';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '../types';
import * as z from 'zod';

export type GeneralFormValues = {
  userName?: string;
  name?: string;
  avatar?: File | null;
  coverImage?: File | null;
  ens?: string;
  bio?: string;
};

type InputType = { label: string; initialValue: string };

export type GeneralFormProps = {
  defaultValues?: GeneralFormValues;
  header: Omit<HeaderProps, 'onAvatarChange' | 'onCoverImageChange'>;
  name: InputType;
  userName?: InputType;
  ens?: InputType;
  bio: InputType;
  ensButton: ButtonType;
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (formValues: GeneralFormValues) => void;
  };
  customStyle?: string;
  onFormDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GeneralForm: React.FC<GeneralFormProps> = ({
  defaultValues = { avatar: null, coverImage: null, name: '', bio: '', ens: '', userName: '' },
  header,
  name: nameField,
  userName: userNameField,
  ens: ensField,
  bio: bioField,
  ensButton,
  cancelButton,
  saveButton,
  customStyle = '',
  onFormDirty,
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<GeneralFormValues>({
    defaultValues,
    resolver: zodResolver(schema),
    mode: 'onChange',
  });
  const onSave = (formValues: GeneralFormValues) => saveButton.handleClick(formValues);

  const isLargeScreen = useMedia('(min-width: 640px)');

  useEffect(() => {
    if (onFormDirty) onFormDirty(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <form onSubmit={handleSubmit(onSave)} className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" spacing="gap-y-3.5" customStyle="h-full">
        <Header
          {...header}
          onAvatarChange={avatar => setValue('avatar', avatar)}
          onCoverImageChange={coverImage => setValue('coverImage', coverImage)}
        />
        <Controller
          control={control}
          name="name"
          render={({ field: { name, value, onChange, ref } }) => (
            <TextField
              type="text"
              name={name}
              label={nameField.label}
              value={value}
              onChange={onChange}
              inputRef={ref}
            />
          )}
          defaultValue={nameField.initialValue || ''}
        />
        {userNameField && (
          <Controller
            control={control}
            name="userName"
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <TextField
                type="text"
                name={name}
                label={userNameField.label}
                value={value}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
                required
                readOnly
              />
            )}
            defaultValue={userNameField.initialValue || ''}
          />
        )}
        {isLargeScreen && ensField && (
          <Stack align="end" justify="between" spacing="gap-x-6" fullWidth>
            <Controller
              control={control}
              name="ens"
              render={({ field: { name, value, onChange, ref } }) => (
                <TextField
                  type="text"
                  name={name}
                  label={ensField.label}
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                  customStyle="grow"
                />
              )}
              defaultValue={ensField.initialValue}
            />
            <Button label={ensButton.label} customStyle="ml-auto" />
          </Stack>
        )}
        {!isLargeScreen && ensField && (
          <>
            <Controller
              control={control}
              name="ens"
              render={({ field: { name, value, onChange, ref } }) => (
                <TextField
                  type="text"
                  name={name}
                  label={ensField?.label}
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                />
              )}
              defaultValue={ensField.initialValue || ''}
            />
            <Button
              label={ensButton?.label}
              onClick={ensButton?.handleClick}
              customStyle="w-fit ml-auto"
            />
          </>
        )}
        <Controller
          control={control}
          name="bio"
          render={({ field: { name, value, onChange, ref } }) => (
            <TextField
              name={name}
              label={bioField.label}
              value={value}
              onChange={onChange}
              inputRef={ref}
              type="multiline"
            />
          )}
          defaultValue={bioField.initialValue || ''}
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
const schema = z.object({
  name: z.string(),
  userName: z.string().optional(),
  avatar: z.any().optional(),
  coverImage: z.any().optional(),
  ens: z.string().optional(),
  bio: z.string().optional(),
});
