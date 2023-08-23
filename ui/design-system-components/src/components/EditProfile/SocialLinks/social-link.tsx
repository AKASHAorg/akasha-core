import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { TextFieldProps } from '@akashaorg/design-system-core/lib/components/TextField/types';

export type SocialLinkProps = {
  onDelete: () => void;
} & TextFieldProps;

export const SocialLink: React.FC<SocialLinkProps> = ({ onDelete, ...textProps }) => {
  return (
    <Stack spacing="gap-x-2" align="baseline">
      <TextField type="text" customStyle="grow" {...textProps} />
      <div className="relative w-5 h-5">
        <Button onClick={onDelete} plain customStyle="absolute top-1 right-0">
          <Icon type="TrashIcon" size="md" color={{ light: 'errorLight', dark: 'errorDark' }} />
        </Button>
      </div>
    </Stack>
  );
};