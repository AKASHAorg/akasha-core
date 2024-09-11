import React, { useCallback, useEffect, useRef, useState } from 'react';
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
 * @param onMenuClick - click handler
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
  const menuButtonRef = useRef(null);
  const anchorRef = useCloseActions(
    () => {
      setShowList(false);
    },
    null,
    false,
  );

  const handleCloseList = () => {
    setShowList(false);
  };

  const handleDocumentClick = useCallback(
    ev => {
      if (anchorRef.current?.contains(ev.target) || ev.target === menuButtonRef.current) {
        return;
      }
      ev.preventDefault();
      ev.stopPropagation();
      setShowList(false);
    },
    [anchorRef],
  );

  useEffect(() => {
    // if the popover is open, add an event handler to prevent nav when clicking outside the menu
    if (showList) {
      document.addEventListener('click', handleDocumentClick, true);
    } else {
      // this ensures that the previous handler is executed before removing it
      document.removeEventListener('click', handleDocumentClick, true);
    }
  }, [anchorRef, handleDocumentClick, showList]);

  useEffect(() => {
    return () => {
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [handleDocumentClick]);

  return (
    rest.items?.length > 0 && (
      <Card type="plain" onClick={onMenuClick}>
        <Stack ref={anchorRef} direction="column" spacing="gap-y-1">
          <Button
            {...anchor}
            ref={menuButtonRef}
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
