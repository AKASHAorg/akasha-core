import React, { useEffect, useMemo, useState } from 'react';
import * as z from 'zod';
import { apply, tw } from '@twind/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

import { SocialLink } from './SocialLink';

import { ButtonType } from '../types';
import { AkashaProfileLinkSource } from '@akashaorg/typings/sdk/graphql-types-new';

type SocialLinkFormValue = {
  links: string[];
};

export type SocialLinksProps = {
  title: string;
  addNewButtonLabel: string;
  description: string;
  socialLinks: AkashaProfileLinkSource[];
  cancelButton: ButtonType;
  saveButton: {
    label: string;
    loading?: boolean;
    handleClick: (formValues: { links: AkashaProfileLinkSource[] }) => void;
  };
  customStyle?: string;
  onDelete: (index: number) => void;
  onFormDirty?: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  title,
  addNewButtonLabel,
  description,
  socialLinks,
  cancelButton,
  saveButton,
  customStyle = '',
  onDelete,
  onFormDirty,
}) => {
  const {
    control,
    handleSubmit,
    unregister,
    formState: { isDirty, isValid },
  } = useForm<SocialLinkFormValue>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  });

  const linkWithPseudoId = useMemo(
    () => socialLinks.map((link, index) => ({ _id: index, ...link })),
    [socialLinks],
  );

  const [links, setLinks] = useState(
    socialLinks.length === 0 ? [{ _id: 0, href: '' }] : linkWithPseudoId,
  );
  const onSave = (formValues: SocialLinkFormValue) =>
    saveButton.handleClick({ links: formValues.links.map(link => ({ href: link })) });
  const onAddNew = () => {
    setLinks([...links, { _id: links.length, href: '' }]);
  };

  useEffect(() => {
    if (onFormDirty) onFormDirty(isDirty);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDirty]);

  return (
    <form onSubmit={handleSubmit(onSave)} className={tw(apply`h-full ${customStyle}`)}>
      <Stack direction="column" spacing="gap-y-4" customStyle="h-full">
        <Stack spacing="gap-y-1" direction="column">
          <Stack spacing="gap-x-2" justify="between" align="center">
            <Text variant="h6">{title}</Text>
            <Button
              variant="text"
              icon="PlusIcon"
              iconDirection="left"
              label={addNewButtonLabel}
              onClick={onAddNew}
            />
          </Stack>
          <Text variant="body2" color={{ light: 'grey4', dark: 'grey6' }} weight="light">
            {description}
          </Text>
        </Stack>
        {links.map((link, index) => {
          const defaultValue = link.href ? { defaultValue: link.href } : {};
          return (
            <Controller
              key={link._id}
              control={control}
              name={`links.${index}`}
              render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
                <SocialLink
                  type="text"
                  onDelete={() => {
                    unregister(`links.${index}`);
                    setLinks(links.filter(_link => _link._id !== link._id));
                    onDelete(index);
                  }}
                  name={name}
                  value={value || ''}
                  caption={error?.message}
                  status={error?.message ? 'error' : null}
                  onChange={onChange}
                  inputRef={ref}
                />
              )}
              {...defaultValue}
            />
          );
        })}
        <Stack spacing="gap-x-2" customStyle="ml-auto mt-auto">
          <Button
            variant="text"
            label={cancelButton.label}
            onClick={cancelButton.handleClick}
            disabled={cancelButton.disabled}
          />
          <Button
            variant="primary"
            loading={saveButton.loading}
            label={saveButton.label}
            disabled={!isDirty || !isValid}
            onClick={handleSubmit(onSave)}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

const schema = z.object({
  links: z
    .string({ required_error: 'Url is required' })
    .url({ message: `Hmm this doesn't look like a URL 🤔` })
    .array(),
});
