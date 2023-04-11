import React, { useMemo, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import * as z from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLink } from './SocialLink';
import { ButtonType } from '../types';

type SocialLinkFormValue = {
  links: string[];
};

export type SocialLinksProp = {
  title: string;
  addNewButtonLabel: string;
  description: string;
  socialLinks: string[];
  cancelButton: ButtonType;
  saveButton: { label: string; handleClick: (formValues: SocialLinkFormValue) => void };
  onDelete: (index: number) => void;
};

export const SocialLinks: React.FC<SocialLinksProp> = ({
  title,
  addNewButtonLabel,
  description,
  socialLinks,
  cancelButton,
  saveButton,
  onDelete,
}) => {
  const {
    control,
    handleSubmit,
    unregister,
    formState: { isDirty, isValid },
  } = useForm<SocialLinkFormValue>({
    resolver: zodResolver(schema),
    mode: 'onBlur',
  });

  const linkWithPseudoId = useMemo(
    () => socialLinks.map((link, index) => ({ _id: index, value: link })),
    [socialLinks],
  );

  const [links, setLinks] = useState(
    socialLinks.length === 0 ? [{ _id: 0, value: '' }] : linkWithPseudoId,
  );

  const onSave = (formValues: SocialLinkFormValue) => saveButton.handleClick(formValues);

  const onAddNew = () => {
    setLinks([...links, { _id: links.length, value: '' }]);
  };

  return (
    <form onSubmit={handleSubmit(onSave)}>
      <Stack direction="column" spacing="gap-y-4">
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
          const defaultValue = link.value ? { defaultValue: link.value } : {};
          return (
            <Controller
              key={link._id}
              control={control}
              name={`links.${index}`}
              render={({ field: { name, value, onChange, ref }, fieldState: { error } }) => (
                <SocialLink
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
        <Stack spacing="gap-x-2" customStyle="ml-auto">
          <Button variant="text" label={cancelButton.label} onClick={cancelButton.handleClick} />
          <Button
            variant="primary"
            label={saveButton.label}
            disabled={!isDirty || !isValid || links.length === 0}
            onClick={handleSubmit(onSave)}
            type="submit"
          />
        </Stack>
      </Stack>
    </form>
  );
};

const schema = z.object({
  links: z.array(
    z
      .string({ required_error: 'Url is required' })
      .url({ message: `Hmm this doesn't look like a URL 🤔` }),
  ),
});
