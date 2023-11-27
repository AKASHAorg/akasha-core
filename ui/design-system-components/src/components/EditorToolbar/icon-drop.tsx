import React from 'react';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export type IconEntry = {
  icon: React.ReactElement;
  handler: () => void;
};

export interface IIconDropProps {
  dropItems: IconEntry[];
}

const IconDrop: React.FC<IIconDropProps> = props => {
  const { dropItems } = props;
  return (
    <Stack customStyle="absolute top-7 right-0">
      {dropItems.map((item, idx) => (
        <button onClick={item.handler}>
          <Stack key={`${item.icon}-${idx}`} align="center" customStyle="rounded-lg cursor-pointer">
            <Icon icon={item.icon} size="sm" />
          </Stack>
        </button>
      ))}
    </Stack>
  );
};

export default IconDrop;
