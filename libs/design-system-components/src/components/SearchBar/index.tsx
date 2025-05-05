import * as React from 'react';

import { SearchIcon } from 'lucide-react';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { cn } from '@akashaorg/ui/lib/library/utils';

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
    inputPlaceholderLabel = 'Search',
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
      spacing={2}
      alignItems="center"
      className={cn(
        'px-2.5 bg-grey9 dark:bg-grey3 rounded-full focus-within:border focus-within:border-secondaryLight dark:focus-within:border-secondaryDark',
        fullWidth && 'w-full',
        customStyle,
      )}
    >
      <input
        type="text"
        className={`peer focus:outline-none w-full bg-transparent py-[0.4375rem] text-[0.875rem] leading-[1.375rem] font-light text-grey5 dark:text-grey6 placeholder-grey5 dark:placeholder-grey6`}
        placeholder={inputPlaceholderLabel}
        value={inputValue}
        onChange={onInputChange}
        onKeyDown={handleSearch}
        onKeyUp={handleKeyUp}
        onFocus={onFocus}
      />
      <SearchIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
    </Stack>
  );
};

export default SearchBar;
