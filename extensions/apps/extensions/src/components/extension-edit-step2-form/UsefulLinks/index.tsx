import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { LinkElement } from './link-element';
import { PlusIcon } from 'lucide-react';
import { Control, useFieldArray } from 'react-hook-form';
import { FormField, FormItem, FormMessage } from '@akashaorg/ui/lib/akasha-components/form';
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
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'links',
  });
  const onAddNew = () => {
    if (fields?.length < 10) {
      append({
        href: '',
        label: '',
      });
    }
  };
  return (
    <Stack direction="column" spacing={4} className={customStyle}>
      <Stack spacing={1} direction="column">
        <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
          <Typography variant="h6">{usefulLinksTitleLabel}</Typography>
          <Button variant="link" onClick={onAddNew}>
            <PlusIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
            {addNewLinkButtonLabel}
          </Button>
        </Stack>
        <Typography variant="sm" className="text-grey4 dark:text-grey6 font-light">
          {usefulLinksDescriptionLabel}
        </Typography>
      </Stack>
      {fields?.map((link, index) => {
        return (
          <FormField
            key={link.id}
            control={control}
            name={`links.${index}`}
            render={({ field: { value, onChange } }) => (
              <FormItem>
                <LinkElement
                  linkElementLabel={linkElementLabel}
                  linkTitlePlaceholder={linkTitlePlaceholderLabel}
                  onDelete={() => {
                    remove(index);
                    onDeleteLink();
                  }}
                  value={{
                    ...value,
                    _id: index + 1,
                  }}
                  onChange={onChange}
                />
                <FormMessage />
              </FormItem>
            )}
            shouldUnregister={true}
            defaultValue={link}
          />
        );
      })}
    </Stack>
  );
};
