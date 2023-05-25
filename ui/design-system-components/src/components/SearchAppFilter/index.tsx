import React from 'react';
import { tw } from '@twind/core';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import DropDown, { DropdownMenuItemGroupType } from '../SearchAppDropdownFilter';

export type ISearchAppFilterProps = {
  dropdownMenuItems: DropdownMenuItemGroupType[];
  selected: DropdownMenuItemGroupType;
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
};

const SearchAppFilter: React.FC<ISearchAppFilterProps> = ({
  dropdownMenuItems,
  selected,
  setSelected,
}) => {
  return (
    <div className={tw('flex justify-between items-center')}>
      <div className={tw('w-2/6 mt-6')}>
        <DropDown
          menuItems={dropdownMenuItems}
          selected={selected}
          setSelected={setSelected}
          optgroup={true}
          divider={true}
          placeholderLabel="All"
        />
      </div>
      <Button variant="secondary" icon="PlusIcon" plain={true}>
        Reset
      </Button>
    </div>
  );
};

export default SearchAppFilter;
