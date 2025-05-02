import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import { TextFieldProps } from '@akashaorg/design-system-core/lib/components/TextField/types';
import { TrashIcon } from 'lucide-react';

export type SocialLinkProps = {
  onDelete: () => void;
} & TextFieldProps;

export const SocialLink: React.FC<SocialLinkProps> = ({ onDelete, ...textProps }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <TextField {...textProps} customStyle="grow" />
      <Stack className="relative w-5 h-5">
        <button onClick={onDelete} className="absolute top-1 right-0">
          <TrashIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        </button>
      </Stack>
    </Stack>
  );
};
