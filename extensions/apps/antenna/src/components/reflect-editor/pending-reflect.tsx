import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import ReflectionCard from '@akashaorg/ui-lib-feed/lib/components/cards/reflection-card';
import { type ReflectEntryData } from '@akashaorg/typings/lib/ui';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';

export type PendingReflectProps = {
  entryData: ReflectEntryData;
};

export function PendingReflect(props: PendingReflectProps) {
  const { entryData } = props;

  return (
    <>
      <Divider />
      <Stack
        background={{ light: 'secondaryLight/10', dark: 'secondaryDark/10' }}
        customStyle="border border(grey8 dark:grey3) -my-2"
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
    </>
  );
}
