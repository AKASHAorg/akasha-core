import React from 'react';

import { IconType } from '@akashaorg/typings/ui';

import Box from '@akashaorg/design-system-core/lib/components/Box';
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
    <Box customStyle="absolute top-7 right-0">
      {dropItems.map((icon, idx) => (
        <Box
          key={`${icon.type}-${idx}`}
          customStyle="flex items-center rounded-lg cursor-pointer"
          onClick={icon.handler}
        >
          <Icon type={icon.type} size="sm" />
        </Box>
      ))}
    </Box>
  );
};

export default IconDrop;
