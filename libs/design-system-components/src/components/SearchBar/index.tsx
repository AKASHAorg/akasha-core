import * as React from 'react';
import { apply, tw } from '@twind/core';

import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import { MagnifyingGlassIcon } from '@akashaorg/design-system-core/lib/components/Icon/hero-icons-outline';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';

export type SearchBarProps = {
  inputValue: string;
  inputPlaceholderLabel?: string;
  fullWidth?: boolean;
  customStyle?: string;
  onSearch?: (keyword: string) => void;
  onKeyUp?: (ev: React.KeyboardEvent<HTMLInputElement>) => void;
  onInputChange: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
};

/**
 * Component used as input for searches, with state controlled from parent
 * @param inputValue - text for search
 * @param inputPlaceholderLabel - style option to display a border only on the bottom
 * @param fullWidth - style option to expand the input
 * @param customStyle - add custom tailwind styles for the wrapper
 * @param onSearch - handler for the search function
 * @param onKeyUp - handler for extra logic related to key input
 * @param onInputChange - handler to update the input state
 */
const SearchBar: React.FC<SearchBarProps> = props => {
  const {
    inputValue,
    customStyle,
    onInputChange,
    inputPlaceholderLabel,
    fullWidth,
    onSearch,
    onKeyUp,
    onFocus,
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
      fullWidth={fullWidth}
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
        onFocus={onFocus}
      />
      <Icon icon={<MagnifyingGlassIcon />} />
    </Stack>
  );
};

SearchBar.defaultProps = {
  inputPlaceholderLabel: 'Search',
};

export default SearchBar;
