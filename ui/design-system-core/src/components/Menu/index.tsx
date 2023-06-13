import React, { ReactNode, useState } from 'react';
import { tw } from '@twind/core';

import Stack from '../Stack';
import List, { ListProps } from '../List';

import { useCloseActions } from '../../utils/useCloseActions';

type MenuProps = {
  anchorElement: ReactNode;
} & ListProps;

const Menu: React.FC<MenuProps> = ({ anchorElement, ...rest }) => {
  const [showList, setShowList] = useState(false);
  const anchorRef = useCloseActions(() => {
    setShowList(false);
  });

  return (
    <Stack direction="column" spacing="gap-y-1">
      <div ref={anchorRef} onClick={() => setShowList(!showList)}>
        {anchorElement}
      </div>

      <div className={tw('relative')}>
        {showList && (
          <div className={tw('absolute right-0')}>
            <List {...rest} />{' '}
          </div>
        )}
      </div>
    </Stack>
  );
};

export default Menu;
