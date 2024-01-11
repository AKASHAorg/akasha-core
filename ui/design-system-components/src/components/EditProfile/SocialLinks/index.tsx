import React, { useMemo, useState } from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { SocialLink } from './social-link';
import { PlusIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { AkashaProfileLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Controller, Control } from 'react-hook-form';
import { EditProfileFormValues } from '../types';

export type SocialLinksProps = {
  linkLabel: string;
  addNewLinkButtonLabel: string;
  description: string;
  customStyle?: string;
  control: Control<EditProfileFormValues>;
  socialLinks: AkashaProfileLinkSource[];
  onDeleteLink: () => void;
};

export const SocialLinks: React.FC<SocialLinksProps> = ({
  linkLabel,
  addNewLinkButtonLabel,
  description,
  socialLinks,
  customStyle = '',
  control,
  onDeleteLink,
}) => {
  const linkWithPseudoId = useMemo(
    () => socialLinks.map((link, index) => ({ _id: index, ...link })),
    [socialLinks],
  );

  const [links, setLinks] = useState(
    socialLinks.length === 0 ? [{ _id: 0, href: '' }] : linkWithPseudoId,
  );

  const onAddNew = () => {
    setLinks([...links, { _id: links.length, href: '' }]);
  };

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle}>
      <Stack spacing="gap-y-1" direction="column">
        <Stack direction="row" spacing="gap-x-2" justify="between" align="center">
          <Text variant="h6">{linkLabel}</Text>
          <Button
            variant="text"
            icon={<PlusIcon />}
            iconDirection="left"
            label={addNewLinkButtonLabel}
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
                  setLinks(links.filter(_link => _link._id !== link._id));
                  onDeleteLink();
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
            shouldUnregister={true}
          />
        );
      })}
    </Stack>
  );
};
