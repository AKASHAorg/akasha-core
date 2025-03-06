import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { LinkElement } from './link-element';
import { PlusIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Control, useFieldArray } from 'react-hook-form';
import { WorldCustomiseFormValues } from '../world-customise-form';
import { FieldName } from '../world-customise-form';
import { FormField, FormItem, FormMessage } from '@akashaorg/ui/lib/akasha-components/form';
import { useTranslation } from 'react-i18next';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';

export type SocialLinksProps = {
  control: Control<WorldCustomiseFormValues>;
  onDeleteLink: () => void;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({ control, onDeleteLink }) => {
  const { t } = useTranslation('app-world-builder');

  const { fields, append, remove } = useFieldArray({ control, name: FieldName.socialLinks });

  const onAddNew = () => {
    if (fields?.length < 12) {
      append({ href: '', name: '' });
    }
  };

  return (
    <Stack direction="column" spacing={4}>
      <Stack spacing={1} direction="column">
        <Stack direction="row" spacing={2} justifyContent="between" alignItems="center">
          <Typography variant="h6">{t('Social links')}</Typography>
          <Button variant="link" onClick={onAddNew}>
            {<PlusIcon />}
            {t('Link')}
          </Button>
        </Stack>
        <Typography variant="xs">
          {t('Add up to 5 social links that would help people to get in touch with world creator.')}
        </Typography>
      </Stack>
      {fields?.map((link, index) => {
        return (
          <FormField
            key={link.id}
            control={control}
            name={`socialLinks.${index}`}
            render={({ field: { value, onChange, ref }, fieldState: { error } }) => (
              <FormItem>
                <LinkElement
                  onDelete={() => {
                    remove(index);
                    onDeleteLink();
                  }}
                  value={{ ...value, _id: index + 1 }}
                  onChange={onChange}
                  error={error as unknown}
                  inputRef={ref}
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
