import React from 'react';
import Toggle from '@akashaorg/design-system-core/lib/components/Toggle';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Controller, Control } from 'react-hook-form';
import { EditProfileFormValues } from '../types';

type InputType = { label: string; description: string; initialValue: boolean };

export type NSFWProps = {
  nsfw: InputType;
  nsfwFormLabel: string;
  control: Control<EditProfileFormValues>;
  disabled?: boolean;
  customStyle?: string;
};

export const NSFW: React.FC<NSFWProps> = props => {
  const { nsfw, nsfwFormLabel, control, disabled, customStyle } = props;

  return (
    <Stack direction="column" spacing="gap-y-2" customStyle={customStyle}>
      <Text variant="h6" as="label">
        {nsfwFormLabel}
      </Text>
      <Controller
        control={control}
        name="nsfw"
        render={({ field: { name, value, onChange } }) => (
          <Stack spacing="gap-y-1">
            <Stack direction="row" justify="between">
              <Text variant="body2" as="label" color={{ light: 'grey4', dark: 'grey6' }}>
                {nsfw.label}
              </Text>
              <Toggle
                id={name}
                name={name}
                checked={value}
                onChange={onChange}
                size="small"
                disabled={disabled}
              />
            </Stack>
            <Text variant="button-md" as="label" color={{ light: 'grey4', dark: 'grey6' }}>
              {nsfw.description}
            </Text>
          </Stack>
        )}
        defaultValue={nsfw.initialValue}
      />
    </Stack>
  );
};
