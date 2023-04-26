import React, { useEffect, useMemo, useState } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import * as z from 'zod';
import { apply, tw } from '@twind/core';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SocialLink } from './SocialLink';
import { ButtonType } from '../types';
import { Link } from '../../types/common.types';
import { getLinkFromType } from '../../../utils/getLinkFromType';

type SocialLinkFormValue = {
  links: string[];
};

export type SocialLinksProp = {
  title: string;
  addNewButtonLabel: string;
  description: string;
  socialLinks: Link[];
  cancelButton: ButtonType;
  saveButton: { label: string; handleClick: (formValues: SocialLinkFormValue) => void };
  customStyle?: string;
  onDelete: (index: number) => void;
  onFormValid?: (valid: boolean) => void;
};

export const SocialLinks: React.FC<SocialLinksProp> = ({
  title,
  addNewButtonLabel,
  description,
  socialLinks,
  cancelButton,
  saveButton,
  customStyle,
  onDelete,
  onFormValid,
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
    () => socialLinks.map((link, index) => ({ _id: index, value: getLinkFromType(link, true) })),
    [socialLinks],
  );

  const [links, setLinks] = useState(
    socialLinks.length === 0 ? [{ _id: 0, value: '' }] : linkWithPseudoId,
  );

  const onSave = (formValues: SocialLinkFormValue) => saveButton.handleClick(formValues);

  const onAddNew = () => {
    setLinks([...links, { _id: links.length, value: '' }]);
  };

  const validForm = !isDirty || !isValid || links.length === 0;

  useEffect(() => {
    if (onFormValid) validForm;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validForm]);

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
          const defaultValue = link.value ? { defaultValue: link.value } : {};
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
          <Button variant="text" label={cancelButton.label} onClick={cancelButton.handleClick} />
          <Button
            variant="primary"
            label={saveButton.label}
            disabled={validForm}
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
