import React from 'react';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import DropDown, { DropdownMenuItemGroupType } from '../SearchAppDropdownFilter';

export type DropDownFilterProps = {
  dropdownMenuItems: DropdownMenuItemGroupType[];
  selected: DropdownMenuItemGroupType;
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
  resetLabel?: string;
  resetHandler: () => void;
};

const DropDownFilter: React.FC<DropDownFilterProps> = ({
  dropdownMenuItems,
  selected,
  setSelected,
  resetLabel = 'Reset',
  resetHandler,
}) => {
  return (
    <Stack direction="row" justify="between" align="center" customStyle="my-6">
      <Stack direction="row" customStyle="w-8/12 lg:w-2/6">
        <DropDown
          menuItems={dropdownMenuItems}
          selected={selected}
          setSelected={setSelected}
          optgroup={true}
          divider={true}
        />
      </Stack>
      <Button
        variant="text"
        size="md"
        plain={true}
        customStyle="text-grey4 dark:text-grey7"
        onClick={resetHandler}
      >
        {resetLabel}
      </Button>
    </Stack>
  );
};

export default DropDownFilter;
