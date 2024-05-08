import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { useMedia } from 'react-use';
import { Controller, Control } from 'react-hook-form';
import { Header, HeaderProps } from './Header';
import { EditProfileFormValues } from '../types';
import { ButtonType } from '../../types/common.types';

type InputType = { label: string; initialValue: string };

export type GeneralProps = {
  header: Omit<HeaderProps, 'onAvatarChange' | 'onCoverImageChange'>;
  name: InputType;
  userName?: InputType;
  ens?: InputType;
  bio: InputType;
  ensButton?: ButtonType;
  customStyle?: string;
  control: Control<EditProfileFormValues>;
  onAvatarChange: (avatar: File) => void;
  onCoverImageChange: (coverImage: File) => void;
};

export const General: React.FC<GeneralProps> = ({
  header,
  name: nameField,
  userName: userNameField,
  ens: ensField,
  bio: bioField,
  ensButton,
  control,
  customStyle = '',
  onAvatarChange,
  onCoverImageChange,
}) => {
  const isLargeScreen = useMedia('(min-width: 640px)');

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle}>
      <Header {...header} onAvatarChange={onAvatarChange} onCoverImageChange={onCoverImageChange} />
      <Controller
        control={control}
        name="name"
        render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
          <TextField
            id={name}
            type="text"
            name={name}
            label={nameField.label}
            value={value}
            onChange={onChange}
            inputRef={ref}
            status={error ? 'error' : null}
            caption={error ? error.message : null}
            required
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
              id={name}
              type="text"
              name={name}
              label={userNameField.label}
              value={value}
              caption={error?.message}
              status={error?.message ? 'error' : null}
              onChange={onChange}
              inputRef={ref}
              readOnly
            />
          )}
          defaultValue={userNameField.initialValue || ''}
        />
      )}
      {isLargeScreen && ensField && (
        <Stack direction="row" align="end" justify="between" spacing="gap-x-6" fullWidth>
          <Controller
            control={control}
            name="ens"
            render={({ field: { name, value, onChange, ref } }) => (
              <TextField
                id={name}
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
                id={name}
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
            id={name}
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
    </Stack>
  );
};
