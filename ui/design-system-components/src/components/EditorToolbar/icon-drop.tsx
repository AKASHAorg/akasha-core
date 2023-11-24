import React from 'react';

import { IconType } from '@akashaorg/typings/lib/ui';

import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';

export type IconEntry = {
  type: IconType;
  handler: () => void;
};

export interface IIconDropProps {
  dropItems: IconEntry[];
}

const IconDrop: React.FC<IIconDropProps> = props => {
  const { dropItems } = props;
  return (
    <Stack customStyle="absolute top-7 right-0">
      {dropItems.map((icon, idx) => (
        <button onClick={icon.handler}>
          <Stack key={`${icon.type}-${idx}`} align="center" customStyle="rounded-lg cursor-pointer">
            {/* <Icon type={icon.type} size="sm" /> */}
          </Stack>
        </button>
      ))}
    </Stack>
  );
};

export default IconDrop;
