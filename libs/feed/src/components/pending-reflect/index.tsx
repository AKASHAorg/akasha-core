import React from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import ReflectionCard from '../cards/reflection-card';
import { type ReflectionData } from '@akashaorg/typings/lib/ui';

export type PendingReflectProps = {
  reflectionData: ReflectionData;
  customStyle?: string;
};

export function PendingReflect(props: PendingReflectProps) {
  const { reflectionData, customStyle = '' } = props;
  return (
    <Stack dataTestId="pending-reflect">
      <Divider />
      <Stack
        background={{ light: 'secondaryLight/10', dark: 'secondaryDark/10' }}
        customStyle={`border border(grey8 dark:grey3) ${customStyle}`}
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
