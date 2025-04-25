import React, { PropsWithChildren } from 'react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';

export type AppInfoPillsProps = {
  customStyle?: string;
};

export const AppInfoPill: React.FC<PropsWithChildren<AppInfoPillsProps>> = props => {
  const { children, customStyle } = props;
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className={`px-2 bg-inherit m-h-[18px] m-w-[18px] rounded-3xl ${customStyle}`}
    >
      {children}
    </Stack>
  );
};
