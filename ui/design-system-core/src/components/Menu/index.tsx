import React, { useState } from 'react';
import { tw } from '@twind/core';

import Button from '../Button';
import Stack from '../Stack';
import List, { ListProps } from '../List';

import { ButtonProps } from '../Button/types';
import { useCloseActions } from '../../utils';

export type MenuProps = {
  anchor: ButtonProps;
} & ListProps;

const Menu: React.FC<MenuProps> = ({ anchor, ...rest }) => {
  const [showList, setShowList] = useState(false);
  const anchorRef = useCloseActions(() => {
    setShowList(false);
  });

  const handleCloseList = () => {
    setShowList(false);
  };

  return (
    <Stack ref={anchorRef} direction="column" spacing="gap-y-1">
      <Button {...anchor} onClick={() => setShowList(!showList)} />

      <div className={tw('relative')}>
        {showList && (
          <div className={tw('absolute right-0 z-50')}>
            <List {...rest} onCloseList={handleCloseList} />
          </div>
        )}
      </div>
    </Stack>
  );
};

export default Menu;
