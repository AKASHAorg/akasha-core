import * as React from 'react';
import { apply, tw } from '@twind/core';

import Icon, { IconProps } from '@akashaorg/design-system-core/lib/components/Icon';
import { MagnifyingGlassIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type SearchBarProps = {
  inputValue: string;
  inputPlaceholderLabel?: string;
  responsive?: boolean;
  searchInputSize?: string;
  iconSize?: IconProps['size'];
  customStyle?: string;
  onSearch: (keyword: string) => void;
  onKeyUp?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: React.FC<SearchBarProps> = props => {
  const {
    inputValue,
    customStyle,
    onInputChange,
    inputPlaceholderLabel,
    responsive,
    onSearch,
    onKeyUp,
  } = props;

  const handleSearch = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (ev.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  const handleKeyUp = (ev: React.KeyboardEvent<HTMLInputElement>) => {
    if (onKeyUp && typeof onKeyUp === 'function') {
      onKeyUp(ev);
    }
  };

  return (
    <Stack
      direction="row"
      spacing="gap-x-2"
      align="center"
      padding="px-2.5"
      fullWidth={responsive}
      customStyle={`bg(grey9 dark:grey3) rounded-full focus-within:border focus-within:border-secondaryLight dark:focus-within:border-secondaryDark ${customStyle}`}
    >
      <input
        type="text"
        className={tw(
          apply`peer focus:outline-none w-full bg-transparent py-[0.4375rem] text-[0.875rem] leading-[1.375rem] font-light text(grey5 dark:grey6) placeholder(grey5 dark:grey6)`,
        )}
        placeholder={inputPlaceholderLabel}
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleSearch}
        onKeyUp={handleKeyUp}
      />
      <Icon icon={<MagnifyingGlassIcon />} />
    </Stack>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search',
};

export default SearchBar;
