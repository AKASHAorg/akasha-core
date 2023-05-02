import React, { useEffect, useMemo, useState } from 'react';
import Stack from '../Stack';
import List, { Item } from '../List';
import TextField from '../TextField';
import { InputProps } from '../TextField/types';
import { useCloseActions } from '../../utils/useCloseActions';
import { tw } from '@twind/core';

type AutoCompleteProps = {
  options: string[];
  customStyle?: string;
};

const AutoComplete: React.FC<AutoCompleteProps & InputProps> = ({
  options,
  customStyle,
  ...rest
}) => {
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const autoCompleteRef = useCloseActions(() => {
    setShowSuggestions(false);
  });

  useEffect(() => {
    setFilters(options.filter(option => option.toLowerCase().startsWith(query.toLowerCase())));
  }, [query, options]);

  const suggestions: Item[] = useMemo(
    () =>
      filters.map(filter => ({
        label: filter,
        onClick: () => ({}),
        variant: 'subtitle2',
      })),
    [filters],
  );

  return (
    <Stack
      direction="column"
      justify="center"
      spacing="gap-y-1"
      customStyle={customStyle}
      ref={autoCompleteRef}
    >
      <TextField
        {...rest}
        iconRight="MagnifyingGlassIcon"
        value={query}
        onChange={event => {
          setQuery(event.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          setShowSuggestions(true);
        }}
        customStyle="rounded-3xl"
        radius={100}
      />
      {showSuggestions && suggestions.length > 0 && (
        <div className={tw('relative')}>
          <List
            items={suggestions}
            showDivider={false}
            customStyle="absolute max-h-28 w-full overflow-y-auto scrollbar"
          />
        </div>
      )}
    </Stack>
  );
};

export default AutoComplete;
