import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import ReflectionCard from '../cards/reflection-card';
import { type ReflectionData } from '@akashaorg/typings/lib/ui';

export type PendingReflectProps = {
  reflectionData: ReflectionData;
  customStyle?: string;
};

export function PendingReflect(props: PendingReflectProps) {
  const { reflectionData, customStyle = '' } = props;
  return (
    <Stack>
      <Separator />
      <Stack
        customStyle={`border border-grey8 dark:border-grey3 bg-secondaryLight/10 dark:bg-secondaryDark/10 ${customStyle}`}
      >
        <ReflectionCard
          reflectionData={reflectionData}
          contentClickable={false}
          pending={true}
          hidePublishTime={true}
          disableActions={true}
        />
      </Stack>
    </Stack>
  );
}
