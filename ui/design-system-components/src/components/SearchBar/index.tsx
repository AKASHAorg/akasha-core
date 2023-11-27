import * as React from 'react';
import { apply, tw } from '@twind/core';

import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import { MagnifyingGlassIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type SearchBarProps = {
  inputValue: string;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  inputPlaceholderLabel?: string;
  onSearch: (keyword: string) => void;
  responsive?: boolean;
  searchInputSize?: string;
  iconSize?: IconProps['size'];
};

const SearchBar: React.FC<SearchBarProps> = props => {
  const {
    inputValue,
    onInputChange,
    inputPlaceholderLabel,
    onSearch,
    // responsive,
    // searchInputSize = 'xsmall',
    // iconSize = 'xs',
  } = props;

  const handleSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  return (
    <Stack
      direction="row"
      spacing="gap-y-2"
      align="center"
      customStyle="px-2.5 bg-grey9 dark:bg-grey3 rounded-full focus-within:border focus-within:border-secondaryLight dark:focus-within:border-secondaryDark"
    >
      <input
        type="text"
        className={tw(
          apply`peer focus:outline-none w-full bg-transparent py-[0.4375rem] text-[0.875rem] leading-[1.375rem] font-light dark:text-grey6 text-grey5 dark:placeholder-grey6 placeholder-grey5`,
        )}
        placeholder={inputPlaceholderLabel}
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleSearch}
      />
      <Icon icon={<MagnifyingGlassIcon />} />
    </Stack>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search',
};

export default SearchBar;
