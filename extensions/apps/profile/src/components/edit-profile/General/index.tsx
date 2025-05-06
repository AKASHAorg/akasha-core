import React from 'react';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { Textarea } from '@akashaorg/ui/lib/akasha-components/textarea';
import { Control } from 'react-hook-form';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@akashaorg/ui/lib/akasha-components/form';
import { Header, HeaderProps } from './Header';
import { EditProfileFormValues } from '../types';
import { ButtonType } from '@akashaorg/design-system-components/lib/components/types/common.types';

const MAX_BIO_LENGTH = 200;

type InputType = { label: string; initialValue: string };

export type GeneralProps = {
  header: Omit<HeaderProps, 'onAvatarChange' | 'onCoverImageChange'>;
  name: InputType;
  ens?: InputType;
  bio: InputType;
  ensButton?: ButtonType;
  control: Control<EditProfileFormValues>;
  onAvatarChange: (avatar: File) => void;
  onCoverImageChange: (coverImage: File) => void;
};

export const General: React.FC<GeneralProps> = ({
  header,
  name: nameField,
  bio: bioField,
  control,
  onAvatarChange,
  onCoverImageChange,
}) => {
  return (
    <React.Fragment>
      <Header {...header} onAvatarChange={onAvatarChange} onCoverImageChange={onCoverImageChange} />
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{nameField.label}</FormLabel>
            <FormControl>
              <Input {...field} onChange={field.onChange} required />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        defaultValue={nameField.initialValue || ''}
      />
      <FormField
        control={control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{bioField.label}</FormLabel>
            <FormControl>
              <Textarea
                className="w-0 min-w-full py-0"
                {...field}
                onChange={field.onChange}
                maxLength={MAX_BIO_LENGTH}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
        defaultValue={bioField.initialValue || ''}
      />
    </React.Fragment>
  );
};
