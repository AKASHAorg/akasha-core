import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { LinkElement } from './link-element';
import { PlusIcon } from 'lucide-react';
import { Controller, Control, useFieldArray } from 'react-hook-form';
import { ExtensionEditStep2FormValues } from '..';

export type UsefulLinksProps = {
  usefulLinksTitleLabel: string;
  addNewLinkButtonLabel: string;
  usefulLinksDescriptionLabel: string;
  linkElementLabel?: string;
  linkTitlePlaceholderLabel?: string;
  customStyle?: string;
  control: Control<ExtensionEditStep2FormValues>;
  onDeleteLink: () => void;
};

export const UsefulLinks: React.FC<UsefulLinksProps> = ({
  usefulLinksTitleLabel,
  addNewLinkButtonLabel,
  usefulLinksDescriptionLabel,
  linkElementLabel,
  linkTitlePlaceholderLabel,
  customStyle = '',
  control,
  onDeleteLink,
}) => {
  const { fields, append, remove } = useFieldArray({ control, name: 'links' });

  const onAddNew = () => {
    if (fields?.length < 10) {
      append({ href: '', label: '' });
    }
  };

  return (
    <Stack direction="column" spacing={4} className={customStyle}>
      <Stack spacing={1} direction="column">
        <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
          <Text variant="h6" as="label">
            {usefulLinksTitleLabel}
          </Text>
          <Button variant="link" onClick={onAddNew}>
            {<PlusIcon className="h-5 w-5" />}
            {addNewLinkButtonLabel}
          </Button>
        </Stack>
        <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
          {usefulLinksDescriptionLabel}
        </Text>
      </Stack>
      {fields?.map((link, index) => {
        return (
          <Controller
            key={link.id}
            control={control}
            name={`links.${index}`}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
              <LinkElement
                linkElementLabel={linkElementLabel}
                linkTitlePlaceholder={linkTitlePlaceholderLabel}
                onDelete={() => {
                  remove(index);
                  onDeleteLink();
                }}
                value={{ ...value, _id: index + 1 }}
                onChange={onChange}
                error={error as unknown}
                inputRef={ref}
              />
            )}
            shouldUnregister={true}
            defaultValue={link}
          />
        );
      })}
    </Stack>
  );
};
