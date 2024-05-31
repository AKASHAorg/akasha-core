import React, { PropsWithChildren } from 'react';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import { Color } from '@akashaorg/design-system-core/lib/components/types/common.types';

export type AppInfoPillsProps = {
  background: Color;
};

export const AppInfoPill: React.FC<PropsWithChildren<AppInfoPillsProps>> = props => {
  const { background, children } = props;
  return (
    <Stack
      direction="row"
      align="center"
      justify="center"
      padding="px-2"
      spacing="gap-x-1"
      background={background}
      customStyle="m-h-[18px] m-w-[18px] rounded-3xl"
    >
      {children}
    </Stack>
  );
};
