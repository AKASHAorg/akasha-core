import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { TextFieldProps } from '@akashaorg/design-system-core/lib/components/TextField/types';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

export type SocialLinkProps = {
  onDelete: () => void;
} & TextFieldProps;

export const SocialLink: React.FC<SocialLinkProps> = ({ onDelete, ...textProps }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <TextField {...textProps} customStyle="grow" />
      <Stack className="relative w-5 h-5">
        <button onClick={onDelete} className="absolute top-1 right-0">
          <Icon icon={<TrashIcon />} size="md" color={{ light: 'errorLight', dark: 'errorDark' }} />
        </button>
      </Stack>
    </Stack>
  );
};
