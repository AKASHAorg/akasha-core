import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { SocialLink } from './social-link';
import { PlusIcon } from 'lucide-react';
import { Controller, Control, useFieldArray } from 'react-hook-form';
import { EditProfileFormValues } from '../types';
export type SocialLinksProps = {
  linkLabel: string;
  addNewLinkButtonLabel: string;
  control: Control<EditProfileFormValues>;
  description: string;
  customStyle?: string;
};
export const SocialLinks: React.FC<SocialLinksProps> = ({
  linkLabel,
  addNewLinkButtonLabel,
  description,
  control,
}) => {
  const { fields, append, remove } = useFieldArray({
    name: 'links',
    control,
  });
  const onAddNew = () => {
    append({
      id: crypto.randomUUID(),
      href: '',
    });
  };
  return (
    <Stack direction="column" spacing={4} className="customStyle">
      <Stack spacing={1} direction="column">
        <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
          <Typography variant="h6">{linkLabel}</Typography>
          <Button variant="link" onClick={onAddNew}>
            <PlusIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            {addNewLinkButtonLabel}
          </Button>
        </Stack>
        <Typography variant="sm" className="text-grey4 dark:text-grey6 font-light">
          {description}
        </Typography>
      </Stack>
      {fields.map((link, index) => {
        const defaultValue = link.href
          ? {
              defaultValue: link.href,
            }
          : {};
        return (
          <Controller
            key={link.id}
            control={control}
            name={`links.${index}.href`}
            render={({ field: { value, onChange } }) => (
              <SocialLink
                onDelete={() => {
                  const foundIndex = fields.findIndex(field => field.id === link.id);
                  if (foundIndex !== -1) remove(foundIndex);
                }}
                aria-label={`link.${index}`}
                value={value || ''}
                onChange={onChange}
              />
            )}
            {...defaultValue}
            shouldUnregister={true}
          />
        );
      })}
    </Stack>
  );
};
