import React from 'react';
import { tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDown, { DropdownMenuItemGroupType } from '../SearchAppDropdownFilter';

export type SearchAppFilterProps = {
  dropdownMenuItems: DropdownMenuItemGroupType[];
  selected: DropdownMenuItemGroupType;
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
  resetLabel?: string;
  resetHandler: () => void;
};

const SearchAppFilter: React.FC<SearchAppFilterProps> = ({
  dropdownMenuItems,
  selected,
  setSelected,
  resetLabel = 'Reset',
  resetHandler,
}) => {
  return (
    <div className={tw('flex justify-between items-center my-6')}>
      <div className={tw('w-2/6')}>
        <DropDown
          menuItems={dropdownMenuItems}
          selected={selected}
          setSelected={setSelected}
          optgroup={true}
          divider={true}
        />
      </div>
      <Button
        variant="text"
        size="md"
        plain={true}
        customStyle="text-grey4 dark:text-grey7"
        onClick={resetHandler}
      >
        {resetLabel}
      </Button>
    </div>
  );
};

export default SearchAppFilter;
