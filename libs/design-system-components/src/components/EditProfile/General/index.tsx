import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { Controller, Control } from 'react-hook-form';
import { Header, HeaderProps } from './Header';
import { EditProfileFormValues } from '../types';
import { ButtonType } from '../../types/common.types';

const MAX_BIO_LENGTH = 200;

type InputType = { label: string; initialValue: string };

export type GeneralProps = {
  header: Omit<HeaderProps, 'onAvatarChange' | 'onCoverImageChange'>;
  name: InputType;
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
  bio: bioField,
  control,
  customStyle = '',
  onAvatarChange,
  onCoverImageChange,
}) => {
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
            maxLength={MAX_BIO_LENGTH}
            type="multiline"
          />
        )}
        defaultValue={bioField.initialValue || ''}
      />
    </Stack>
  );
};
