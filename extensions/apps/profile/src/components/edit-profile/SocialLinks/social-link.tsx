import React from 'react';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';

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
          <Icon
            icon={<TrashIcon />}
            size="md"
            customStyle="[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark"
          />
        </button>
      </Stack>
    </Stack>
  );
};
