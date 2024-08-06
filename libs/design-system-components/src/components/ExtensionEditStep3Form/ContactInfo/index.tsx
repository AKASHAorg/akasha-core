import React, { useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { InfoField } from './info-field';
import { PlusIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Controller, Control } from 'react-hook-form';
import { ExtensionEditStep3FormValues } from '..';

export type ContactInfoProps = {
  contactLabel: string;
  addButtonLabel: string;
  description: string;
  customStyle?: string;
  control: Control<ExtensionEditStep3FormValues>;
  contactInfo: string[];
  onDeleteInfoField: () => void;
};

export const ContactInfo: React.FC<ContactInfoProps> = ({
  contactLabel,
  addButtonLabel,
  description,
  contactInfo,
  customStyle = '',
  control,
  onDeleteInfoField,
}) => {
  const [infoFields, setInfoFields] = useState(contactInfo || ['']);

  const onAddNew = () => {
    setInfoFields([...infoFields, '']);
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle}>
      <Stack spacing="gap-y-1" direction="column">
        <Stack direction="row" spacing="gap-x-2" justify="between" align="center">
          <Text variant="h6">{contactLabel}</Text>
          <Button
            variant="text"
            icon={<PlusIcon />}
            iconDirection="left"
            label={addButtonLabel}
            onClick={onAddNew}
          />
        </Stack>
        <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
          {description}
        </Text>
      </Stack>
      {infoFields.map((infoField, index) => {
        return (
          <Controller
            key={index}
            control={control}
            name={`contactInfo.${index}`}
            render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
              <InfoField
                type="text"
                onDelete={() => {
                  setInfoFields(infoFields.filter(_infoField => _infoField !== infoField));
                  onDeleteInfoField();
                }}
                name={name}
                value={value || ''}
                caption={error?.message}
                status={error?.message ? 'error' : null}
                onChange={onChange}
                inputRef={ref}
              />
            )}
            defaultValue={contactInfo[index]}
          />
        );
      })}
    </Stack>
  );
};
