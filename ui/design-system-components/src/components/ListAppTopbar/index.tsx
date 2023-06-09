import React from 'react';
import { tw } from '@twind/core';
import { useTranslation } from 'react-i18next';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDown from '@akashaorg/design-system-core/lib/components/Dropdown';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import List, { ListProps } from '@akashaorg/design-system-core/lib/components/List';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type ListAppTopbarProps = {
  resetLabel?: string;
  handleIconMenuClick: () => void;
};

const ListAppTopbar: React.FC<ListAppTopbarProps> = ({
  resetLabel = 'Reset',
  handleIconMenuClick,
}) => {
  const { t } = useTranslation('app-lists');

  const [filterByCategory, setfilterCategory] = React.useState(null);

  const [showMenu, setShowMenu] = React.useState(false);

  const dropDownActions: ListProps['items'] = [
    {
      label: 'Remove All',
      onClick: () => {
        setShowMenu(!showMenu);
        handleIconMenuClick();
      },
    },
  ];

  const dropDownMenuItems = [
    { id: '0', title: t('All Categories') },
    { id: '1', title: t('Beams') },
    { id: '2', title: t('Reflections') },
  ];

  const resetHandler = () => {
    setfilterCategory(dropDownMenuItems[0]);
  };

  return (
    <React.Fragment>
      <Stack justify="between" customStyle="my-3">
        <Text variant="h5" align="center">
          <>{t('Your List')}</>
        </Text>
        <Stack customStyle="relative">
          <Button plain={true} onClick={() => setShowMenu(!showMenu)}>
            <Icon type="EllipsisHorizontalIcon" accentColor={true} />
          </Button>
          {showMenu && <List items={dropDownActions} customStyle="absolute right-0 top-7 w-max" />}
        </Stack>
      </Stack>
      <div className={tw('flex justify-between items-center')}>
        <div className={tw('w-full md:w-2/6 mt-6')}>
          <DropDown
            name="filterByCategory"
            selected={filterByCategory}
            menuItems={dropDownMenuItems}
            setSelected={setfilterCategory}
          />
        </div>
        <Button
          variant="secondary"
          plain={true}
          size="md"
          customStyle="text-grey4 dark:text-grey7"
          onClick={resetHandler}
        >
          {resetLabel}
        </Button>
      </div>
    </React.Fragment>
  );
};

export default ListAppTopbar;
