import React from 'react';
import { tw } from '@twind/core';

import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

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
  const [filterByCategory, setfilterCategory] = React.useState(null);

  const [showMenu, setShowMenu] = React.useState(false);

  const dropDownActions: ListProps['items'] = [
    {
      label: removeAllLabel,
      onClick: () => {
        setShowMenu(!showMenu);
        handleIconMenuClick();
      },
    },
  ];

  const resetHandler = () => {
    setfilterCategory(dropDownMenuItems[0]);
  };

  return (
    <React.Fragment>
      <Stack justify="between" direction="row" customStyle="my-3">
        <Text variant="h5">{titleLabel}</Text>

        <Stack customStyle="relativ w-min">
          <Button plain={true} onClick={() => setShowMenu(!showMenu)}>
            <Icon type="EllipsisHorizontalIcon" accentColor={true} />
          </Button>

          {showMenu && <List items={dropDownActions} customStyle="absolute right-0 top-7 w-max" />}
        </Stack>
      </Stack>

      <div className={tw('flex justify-between items-center my-2')}>
        <div className={tw('w-8/12 sm:w-full md:w-3/6')}>
          <DropDown
            name="filterByCategory"
            selected={filterByCategory}
            menuItems={dropDownMenuItems}
            setSelected={setfilterCategory}
          />
        </div>

        <Button variant="secondary" plain={true} size="md" onClick={resetHandler}>
          <Text
            variant="body2"
            color={
              filterByCategory?.id !== '0'
                ? { light: 'secondaryLight', dark: 'secondaryDark' }
                : { light: 'grey4', dark: 'grey7' }
            }
          >
            {resetLabel}
          </Text>
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ListAppTopbar;
