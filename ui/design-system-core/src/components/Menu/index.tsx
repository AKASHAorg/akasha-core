import React, { useState } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import List, { ListProps } from '../List';
import { tw } from '@twind/core';
import { ButtonProps } from '../Button/types';
import { useCloseActions } from '../../utils';

export type MenuProps = {
  anchor: ButtonProps;
  disabled?: boolean;
} & ListProps;

const Menu: React.FC<MenuProps> = ({ anchor, disabled, ...rest }) => {
  const [showList, setShowList] = useState(false);
  const anchorRef = useCloseActions(() => {
    setShowList(false);
  });

  const handleCloseList = () => {
    setShowList(false);
  };

  return (
    <Stack ref={anchorRef} direction="column" spacing="gap-y-1">
      <Button {...anchor} disabled={disabled} onClick={() => setShowList(!showList)} />

      <div className={tw('relative')}>
        {showList && (
          <div className={tw('absolute right-0 z-50')}>
            <List {...rest} onSelected={handleCloseList} />
          </div>
        )}
      </div>
    </Stack>
  );
};

export default Menu;
