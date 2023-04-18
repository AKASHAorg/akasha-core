import React, { useEffect, useMemo, useState } from 'react';
import Stack from '../Stack';
import ActionDropdown, { Action } from '../ActionDropDown';
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
  const [showOptions, setShowOptions] = useState(false);

  const autoCompleteRef = useCloseActions(() => {
    setShowOptions(false);
  });

  useEffect(() => {
    setFilters(options.filter(option => option.toLowerCase().startsWith(query.toLowerCase())));
  }, [query, options]);

  const actions: Action[] = useMemo(
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
          setShowOptions(true);
        }}
        onFocus={() => {
          setShowOptions(true);
        }}
        customStyle="rounded-3xl"
        radius={100}
      />
      {showOptions && actions.length > 0 && (
        <div className={tw('relative')}>
          <ActionDropdown
            actions={actions}
            showDivider={false}
            customStyle="absolute max-h-28 w-full overflow-y-auto scrollbar"
          />
        </div>
      )}
    </Stack>
  );
};

export default AutoComplete;
