import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { TrashIcon } from 'lucide-react';

export type SocialLinkProps = {
  onDelete: () => void;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  value: string;
};

export const SocialLink: React.FC<SocialLinkProps> = ({ onDelete, value, onChange }) => {
  return (
    <Stack direction="row" spacing={2} alignItems="baseline">
      <Input value={value} onChange={onChange} className="grow" />
      <Stack className="relative w-5 h-5">
        <button onClick={onDelete} className="absolute top-1 right-0">
          <TrashIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        </button>
      </Stack>
    </Stack>
  );
};
