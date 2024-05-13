import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectionCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflection-card';
import { type ReflectEntryData } from '@akashaorg/typings/lib/ui';

export type PendingReflectProps = {
  entryData: ReflectEntryData;
};

export function PendingReflect(props: PendingReflectProps) {
  const { entryData } = props;

  return (
    <Stack
      background={{ light: 'secondaryLight/30', dark: 'secondaryDark/30' }}
      customStyle="border border(grey8 dark:grey3)"
      data-testid="pending-reflect"
    >
      <ReflectionCard
        entryData={entryData}
        contentClickable={false}
        pending={true}
        hidePublishTime={true}
        disableActions={true}
      />
    </Stack>
  );
}
