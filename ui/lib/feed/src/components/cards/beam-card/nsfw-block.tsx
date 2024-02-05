import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import React, { PropsWithChildren, useEffect } from 'react';

type NSFWBlockType = {
  nsfw: boolean;
  onNsfwChange: (nsfw: boolean) => void;
};
const NSFWBlock: React.FC<PropsWithChildren<NSFWBlockType>> = props => {
  const { nsfw, children, onNsfwChange } = props;

  useEffect(() => {
    onNsfwChange(nsfw);
  }, [nsfw, onNsfwChange]);

  return (
    <Stack
      justify="center"
      direction="row"
      background={{ light: 'grey9', dark: 'grey5' }}
      customStyle="rounded-[10px]"
    >
      {children}
    </Stack>
  );
};

export default NSFWBlock;
