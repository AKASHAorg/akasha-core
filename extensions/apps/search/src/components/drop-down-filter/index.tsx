import React from 'react';
import { Button } from '@akashaorg/ui/lib/akasha-components/button';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import DropDown, { DropdownMenuItemGroupType } from '../base-dropdown-filter';

export type DropDownFilterProps = {
  dropdownMenuItems: DropdownMenuItemGroupType[];
  selected: DropdownMenuItemGroupType;
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
  resetLabel?: string;
  resetHandler?: () => void;
};

const DropDownFilter: React.FC<DropDownFilterProps> = ({
  dropdownMenuItems,
  selected,
  setSelected,
  resetLabel = 'Reset',
  resetHandler,
}) => {
  return (
    <Stack direction="row" justifyContent="between" alignItems="center" className="my-6">
      <Stack direction="row" className="w-8/12 lg:w-2/6">
        <DropDown
          menuItems={dropdownMenuItems}
          selected={selected}
          setSelected={setSelected}
          optgroup={true}
          divider={true}
        />
      </Stack>
      {typeof resetHandler === 'function' && (
        <Button variant="link" className="text-grey4 dark:text-grey7" onClick={resetHandler}>
          {resetLabel}
        </Button>
      )}
    </Stack>
  );
};

export default DropDownFilter;
