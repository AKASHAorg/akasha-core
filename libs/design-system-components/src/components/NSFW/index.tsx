import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
      <Typography variant="h6">{nsfwFieldLabel}</Typography>
      <Controller
        control={control}
        name={name}
        render={({ field: { name, value, onChange } }) => (
          <Stack spacing={1}>
            <Stack direction="row" justifyContent="between">
              <Typography variant="sm" className="text-grey4 dark:text-grey6">
                {nsfw.label}
              </Typography>
              <Switch
                id={name}
                name={name}
                checked={value}
                onCheckedChange={onChange}
                disabled={disabled}
              />
            </Stack>
            {nsfw.description && (
              <Typography variant="sm" bold className="text-grey4 dark:text-grey6">
                {nsfw.description}
              </Typography>
            )}
          </Stack>
        )}
        defaultValue={defaultValue}
      />
    </Stack>
  );
};
