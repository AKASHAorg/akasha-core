import React, { PropsWithChildren } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Color } from '@akashaorg/design-system-core/lib/components/types/common.types';

export type AppInfoPillsProps = {
  background: Color;
  customStyle?: string;
};

export const AppInfoPill: React.FC<PropsWithChildren<AppInfoPillsProps>> = props => {
  const { background, children, customStyle } = props;
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className={`px-2 bg-inherit m-h-[18px] m-w-[18px] rounded-3xl bg-${background} ${customStyle}`}
    >
      {children}
    </Stack>
  );
};
