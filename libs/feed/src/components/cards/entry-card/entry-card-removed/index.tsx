import React from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { TriangleAlertIcon } from 'lucide-react';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { cn } from '@akashaorg/ui/lib/library/utils';

export type EntryCardRemovedProps =
  | { message: React.ReactNode; type: 'author' }
  | { message: React.ReactNode; type: 'others' };

const EntryCardRemoved: React.FC<EntryCardRemovedProps> = props => {
  return (
    <Card
      className={cn(
        props.type === 'author' ? 'muted opacity-50' : 'destructive opacity-30 border-destructive',
        'rounded-[0.625rem] px-4 py-2 bg-nested-card',
      )}
    >
      <Stack direction="row" spacing={1}>
        <TriangleAlertIcon className="[&>*]:stroke-errorLight dark:[&>*]:stroke-errorDark" />
        <Stack spacing={1} className="grow">
          {props.message}
        </Stack>
      </Stack>
    </Card>
  );
};

export default EntryCardRemoved;
