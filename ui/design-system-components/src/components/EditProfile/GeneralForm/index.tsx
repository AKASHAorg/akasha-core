import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { Header, HeaderProps } from './Header';
import { useForm, Controller } from 'react-hook-form';
import { useMedia } from 'react-use';
import { zodResolver } from '@hookform/resolvers/zod';
import { ButtonType } from '../types';
import * as z from 'zod';

type GeneralFormValues = {
  userName?: string;
  name?: string;
  avatar?: string;
  coverImage?: string;
  ens?: string;
  bio?: string;
};

type InputType = { label: string; initialValue: string };

export type GeneralFormProps = {
  header: Omit<HeaderProps, 'onAvatarChange' | 'onCoverImageChange'>;
  name: InputType;
  userName: InputType;
  ens: InputType;
  bio: InputType;
  ensButton: ButtonType;
  cancelButton: ButtonType;
  saveButton: { label: string; handleClick: (formValues: GeneralFormValues) => void };
};

export const GeneralForm: React.FC<GeneralFormProps> = ({
  header,
  name: nameField,
  userName: userNameField,
  ens: ensField,
  bio: bioField,
  ensButton,
  cancelButton,
  saveButton,
}) => {
  const {
    control,
    setValue,
    handleSubmit,
    formState: { isDirty, isValid },
  } = useForm<GeneralFormValues>({
    resolver: zodResolver(schema),
  });

  const onSave = (formValues: GeneralFormValues) => saveButton.handleClick(formValues);

  const isLargeScreen = useMedia('(min-width: 640px)');

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack direction="column" spacing="gap-y-3.5">
        <Header
          {...header}
          onAvatarChange={avatar => setValue('avatar', avatar?.url || avatar?.fallbackUrl)}
          onCoverImageChange={coverImage =>
            setValue('coverImage', coverImage?.url || coverImage?.fallbackUrl)
          }
        />
        <Controller
          control={control}
          name="name"
          render={({ field: { name, value, onChange, ref } }) => (
            <TextField
              name={name}
              label={nameField.label}
              value={value}
              onChange={onChange}
              inputRef={ref}
            />
          )}
          defaultValue={nameField.initialValue}
        />
        <Controller
          control={control}
          name="userName"
          render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
            <TextField
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
          defaultValue={userNameField.initialValue ? userNameField.initialValue : ''}
        />

        {isLargeScreen && (
          <Stack align="end" justify="between" spacing="gap-x-6" fullWidth>
            <Controller
              control={control}
              name="ens"
              render={({ field: { name, value, onChange, ref } }) => (
                <TextField
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
        {!isLargeScreen && (
          <>
            <Controller
              control={control}
              name="ens"
              render={({ field: { name, value, onChange, ref } }) => (
                <TextField
                  name={name}
                  label={ensField.label}
                  value={value}
                  onChange={onChange}
                  inputRef={ref}
                />
              )}
              defaultValue={ensField.initialValue}
            />
            <Button
              label={ensButton.label}
              onClick={ensButton.handleClick}
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
          defaultValue={bioField.initialValue}
        />
        <Stack spacing="gap-x-2" customStyle="ml-auto mt-auto">
          <Button variant="text" label={cancelButton.label} onClick={cancelButton.handleClick} />
          <Button
            variant="primary"
            label={saveButton.label}
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
  name: z.string().optional(),
  userName: z.string().min(1, 'User name is required'),
  avatar: z.string().optional(),
  coverImage: z.string().optional(),
  ens: z.string().optional(),
  bio: z.string().optional(),
});
