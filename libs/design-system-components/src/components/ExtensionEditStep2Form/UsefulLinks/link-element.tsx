import React from 'react';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { TrashIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
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
    <Stack fullWidth direction="column" spacing="gap-2">
      <Stack fullWidth direction="row" justify="between" align="center">
        <Text variant="h6" as="label">
          {`${linkElementLabel} ${value._id}`}
        </Text>
        <div className="relative w-5 h-5">
          <Button onClick={onDelete} plain customStyle="absolute top-1 right-0">
            <Icon
              icon={<TrashIcon />}
              size="md"
              color={{ light: 'errorLight', dark: 'errorDark' }}
            />
          </Button>
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
