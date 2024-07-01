import React, { useState } from 'react';
import Button from '../Button';
import Card from '../Card';
import Stack from '../Stack';
import List, { ListProps } from '../List';
import { tw } from '@twind/core';
import { ButtonProps } from '../Button/types';
import { useCloseActions } from '../../utils';

export type MenuProps = {
  anchor: ButtonProps;
  disabled?: boolean;
  onMenuClick?: (e: React.SyntheticEvent) => void;
} & ListProps;

/**
 * A Menu component makes it easier to add an ellipsis menu in your app. A typical use case
 * is for saving UI space by hiding less critical options under a single icon.
 * A Menu component takes all the props of a List component, plus more:
 * @param anchor - the anchored menu icon to be displayed
 * @param disabled - boolean (optional) whether to disable the menu completely
 * @example
 * ```tsx
 *   <Menu
 *      anchor={{
 *      icon: <EllipsisHorizontalIcon />,
 *      variant: 'primary',
 *      greyBg: true,
 *      iconOnly: true,
 *      'aria-label': 'settings',
 *      }}
 *      items={dropDownActions}
 *    />
 * ```
 **/
const Menu: React.FC<MenuProps> = ({ anchor, disabled, onMenuClick, ...rest }) => {
  const [showList, setShowList] = useState(false);
  const anchorRef = useCloseActions(() => {
    setShowList(false);
  });

  const handleCloseList = () => {
    setShowList(false);
  };

  return (
    rest.items?.length > 0 && (
      <Card type="plain" onClick={onMenuClick}>
        <Stack ref={anchorRef} direction="column" spacing="gap-y-1">
          <Button
            {...anchor}
            disabled={disabled}
            onClick={(event: React.SyntheticEvent) => {
              setShowList(!showList);
              event.preventDefault();
              event.stopPropagation();
            }}
          />

          <div className={tw('relative')}>
            {showList && (
              <div className={tw('absolute right-0 z-50')}>
                <List {...rest} onSelected={handleCloseList} />
              </div>
            )}
          </div>
        </Stack>
      </Card>
    )
  );
};

export default Menu;
