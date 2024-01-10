import React, { PropsWithChildren } from 'react';
import Stack from '../Stack';
import { Color } from '../types/common.types';

export type BadgeProps = {
  background?: Color;
};

const Badge: React.FC<PropsWithChildren<BadgeProps>> = props => {
  const { children, background = { light: 'black', dark: 'white' } } = props;
  return (
    <Stack
      align="center"
      justify="center"
      background={background}
      customStyle="h-[18px] w-[18px] rounded-full"
    >
      {children}
    </Stack>
  );
};

export default Badge;
