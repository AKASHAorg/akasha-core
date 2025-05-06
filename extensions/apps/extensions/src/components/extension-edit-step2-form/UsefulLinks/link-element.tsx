import React from 'react';

import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Input } from '@akashaorg/ui/lib/akasha-components/input';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AppLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';

export type LinkElementProps = {
  linkElementLabel?: string;
  linkTitlePlaceholder?: string;
  onDelete: () => void;
  onChange: (...event: any[]) => void;
  value: AppLinkSource & { _id?: number };
};

export const LinkElement: React.FC<LinkElementProps> = ({
  linkElementLabel,
  linkTitlePlaceholder,
  onDelete,
  onChange,
  value,
}) => {
  return (
    <Stack direction="column" spacing={2} className="w-full">
      <Stack direction="row" justifyContent="between" alignItems="center" className="w-full">
        <Text variant="h6" as="label">
          {`${linkElementLabel} ${value._id}`}
        </Text>
        <div className="relative w-5 h-5">
          <button onClick={onDelete} className="absolute top-1 right-0">
            <Icon
              icon={<TrashIcon />}
              size="md"
              customStyle={'[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark'}
            />
          </button>
        </div>
      </Stack>
      <Input
        className="w-full"
        placeholder={linkTitlePlaceholder}
        value={value.label}
        onChange={ev => onChange({ ...value, label: ev.target.value })}
      />
      <Input
        className="w-full"
        placeholder="URL"
        value={value.href}
        onChange={ev => onChange({ ...value, href: ev.target.value })}
      />
    </Stack>
  );
};
