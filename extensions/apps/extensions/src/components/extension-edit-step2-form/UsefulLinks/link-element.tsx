import React from 'react';

import { TrashIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import TextField from '@akashaorg/design-system-core/lib/components/TextField';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import { AppLinkSource } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { FieldError } from 'react-hook-form';

export type LinkElementProps = {
  linkElementLabel?: string;
  linkTitlePlaceholder?: string;
  onDelete: () => void;
  onChange: (...event: any[]) => void;
  value: AppLinkSource & { _id?: number };
  error?: { href?: FieldError; label?: FieldError };
  inputRef?: React.LegacyRef<HTMLInputElement> & React.LegacyRef<HTMLTextAreaElement>;
};

export const LinkElement: React.FC<LinkElementProps> = ({
  linkElementLabel,
  linkTitlePlaceholder,
  onDelete,
  onChange,
  value,
  error,
  inputRef,
}) => {
  return (
    <Stack direction="column" spacing={2} className="w-full">
      <Stack direction="row" justifyContent="between" alignItems="center" className="w-full">
        <Text variant="h6" as="label">
          {`${linkElementLabel} ${value._id}`}
        </Text>
        <div className="relative w-5 h-5">
          <button onClick={onDelete} className="absolute top-1 right-0">
            <TrashIcon className="h-5 w-5 [&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
          </button>
        </div>
      </Stack>

      <TextField
        type="text"
        customStyle="grow"
        value={value?.label}
        placeholder={linkTitlePlaceholder}
        onChange={ev => onChange({ ...value, label: ev.target.value })}
        caption={error?.label?.message}
        status={error?.label?.message ? 'error' : null}
      />
      <TextField
        inputRef={inputRef}
        type="text"
        customStyle="grow"
        value={value?.href}
        placeholder="URL"
        onChange={ev => onChange({ ...value, href: ev.target.value })}
        caption={error?.href?.message}
        status={error?.href?.message ? 'error' : null}
      />
    </Stack>
  );
};
