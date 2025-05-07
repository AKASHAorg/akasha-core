import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { Controller, Control, FieldValues, Path, PathValue } from 'react-hook-form';
import { Switch } from '@akashaorg/ui/lib/components/switch';

export type InputType = { label: string; description?: string; initialValue: boolean };

export type NSFWProps<T extends FieldValues> = {
  nsfw: InputType;
  nsfwFieldLabel: string;
  control: Control<T>;
  name: Path<T>;
  defaultValue: PathValue<T, Path<T>>;
  disabled?: boolean;
  customStyle?: string;
};

export const NSFW = <T extends FieldValues>({
  nsfw,
  nsfwFieldLabel,
  control,
  name,
  disabled,
  customStyle,
  defaultValue,
}: NSFWProps<T>) => {
  return (
    <Stack direction="column" spacing={2} className={customStyle}>
      <Text variant="h6" as="label">
        {nsfwFieldLabel}
      </Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { name, value, onChange } }) => (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="between">
              <Text variant="body2" as="label" color={{ light: 'grey4', dark: 'grey6' }}>
                {nsfw.label}
              </Text>
              <Switch
                id={name}
                name={name}
                checked={value}
                onCheckedChange={onChange}
                disabled={disabled}
              />
            </Stack>
            {nsfw.description && (
              <Text variant="button-md" as="label" color={{ light: 'grey4', dark: 'grey6' }}>
                {nsfw.description}
              </Text>
            )}
          </Stack>
        )}
        defaultValue={defaultValue}
      />
    </Stack>
  );
};
