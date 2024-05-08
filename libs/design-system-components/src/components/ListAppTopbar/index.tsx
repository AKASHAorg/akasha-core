import React from 'react';
import { tw } from '@twind/core';

import DropDownFilter from '../DropDownFilter';
import { EllipsisHorizontalIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Menu, { MenuProps } from '@akashaorg/design-system-core/lib/components/Menu';

export type ListAppTopbarProps = {
  titleLabel: string;
  resetLabel: string;
  removeAllLabel: string;
  dropDownMenuItems: { id: string; title: string }[];
  handleIconMenuClick: () => void;
};

const ListAppTopbar: React.FC<ListAppTopbarProps> = ({
  titleLabel,
  resetLabel,
  removeAllLabel,
  dropDownMenuItems,
  handleIconMenuClick,
}) => {
  const [filterByCategory, setFilterByCategory] = React.useState(null);

  const [showMenu, setShowMenu] = React.useState(false);

  const dropDownActions: MenuProps['items'] = [
    {
      label: removeAllLabel,
      onClick: () => {
        setShowMenu(!showMenu);
        handleIconMenuClick();
      },
    },
  ];

  const resetHandler = () => {
    setFilterByCategory(dropDownMenuItems[0]);
  };

  return (
    <React.Fragment>
      <Stack justify="between" direction="row" customStyle="my-3">
        <Text variant="h5">{titleLabel}</Text>
        <Menu
          anchor={{
            icon: <EllipsisHorizontalIcon />,
            variant: 'primary',
            greyBg: true,
            iconOnly: true,
            'aria-label': 'settings',
          }}
          items={dropDownActions}
          customStyle="w-max z-99"
        />
      </Stack>

      <div className={tw('flex justify-between items-center my-2')}>
        <div className={tw('w-full')}>
          <DropDownFilter
            selected={filterByCategory}
            dropdownMenuItems={dropDownMenuItems}
            setSelected={setFilterByCategory}
            resetHandler={resetHandler}
            resetLabel={resetLabel}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ListAppTopbar;
