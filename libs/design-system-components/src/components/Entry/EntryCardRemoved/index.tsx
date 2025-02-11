import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { ExclamationTriangleIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import { Card } from '@akashaorg/ui/lib/components/card';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type EntryCardRemovedProps =
  | { message: React.ReactNode; type: 'author' }
  | { message: React.ReactNode; type: 'others' };

const EntryCardRemoved: React.FC<EntryCardRemovedProps> = props => {
  return (
    <Card
      className={cn(
        props.type === 'author' ? 'muted opacity-50' : 'destructive opacity-30 border-destructive',
        'rounded-[10px] px-4 py-2',
      )}
    >
      <Stack direction="row" spacing="gap-x-1">
        <Icon color="errorLight" icon={<ExclamationTriangleIcon />} />
        <Stack spacing="gap-y-1" customStyle="grow">
          {props.message}
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntryCardRemoved;
