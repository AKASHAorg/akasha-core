import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

import { cn } from '@/library/utils';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/command';
import { Input } from '@/akasha-components/input';

const AutocompleteContext = React.createContext<
  | ((
      | {
          multiple: true;
          onValueChange?: (value: string[]) => void;
        }
      | { multiple?: false; onValueChange?: (value: string) => void }
    ) & {
      searchValue: string;
      open: boolean;
      emptyMessage: string;
      loading?: boolean;
      selectedValues: string[];
      setSearchValue: React.Dispatch<React.SetStateAction<string>>;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    })
  | null
>(null);

const useAutocompleteContext = () => {
  const context = React.useContext(AutocompleteContext);
  if (!context) {
    throw new Error('`useAutocompleteContext` must be used within `Autocomplete`');
  }
  return context;
};

const Autocomplete = React.forwardRef<
  React.ElementRef<typeof Command>,
  {
    emptyMessage?: string;
    loading?: boolean;
    className?: string;
    children?: React.ReactNode;
  } & (
    | {
        multiple: true;
        value?: string[];
        onValueChange?: (value: string[]) => void;
      }
    | {
        multiple?: false;
        value?: string;
        onValueChange?: (value: string) => void;
      }
  )
>(({ emptyMessage = '', loading = false, className, children, ...props }, ref) => {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');

  const getSelectedValues = React.useCallback(() => {
    if (props.multiple) return props.value || [];
    return typeof props.value === 'string' ? [props.value] : [];
  }, [props.multiple, props.value]);

  return (
    <AutocompleteContext.Provider
      value={{
        ...props,
        searchValue,
        emptyMessage,
        open,
        selectedValues: getSelectedValues(),
        loading,
        setOpen,
        setSearchValue,
      }}
    >
      <Command
        ref={ref}
        data-slot="autocomplete"
        className={cn(
          'relative flex flex-col gap-2 bg-transparent rounded-lg text-sm overflow-visible',
          className,
        )}
      >
        <div className="hidden">
          <CommandInput value={searchValue} />
        </div>
        {children}
      </Command>
    </AutocompleteContext.Provider>
  );
});
Autocomplete.displayName = 'Autocomplete';

const AutocompleteTrigger = React.forwardRef<
  React.ElementRef<typeof Input>,
  | { asChild: true; children?: React.ReactNode }
  | (React.ComponentProps<'input'> & { asChild?: false })
>((props, ref) => {
  const { searchValue, setSearchValue, setOpen, multiple } = useAutocompleteContext();

  const { asChild, ...rest } = props;
  const Comp = asChild ? (Slot as typeof Input) : Input;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
    setOpen(true);
    if (asChild === false) {
      props.onChange?.(event);
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setOpen(true);
    if (asChild === false) {
      props.onFocus?.(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setOpen(false);
    if (!multiple) {
      setSearchValue(searchValue || '');
    }
    if (asChild === false) {
      props.onBlur?.(event);
    }
  };

  return (
    <Comp
      ref={ref}
      data-slot="autocomplete-trigger"
      value={searchValue}
      type="search"
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...rest}
    />
  );
});
AutocompleteTrigger.displayName = 'AutocompleteTrigger';

const AutocompleteList = React.forwardRef<
  React.ElementRef<typeof CommandList>,
  React.ComponentProps<typeof CommandList>
>(({ className, children, ...props }, ref) => {
  const { open, loading, emptyMessage } = useAutocompleteContext();

  return (
    <CommandList
      ref={ref}
      data-slot="autocomplete-list"
      className={cn(
        'absolute top-11 animate-in fade-in-0 zoom-in-95 z-10 w-full border rounded-lg bg-card p-1',
        {
          hidden: !open,
        },
        !emptyMessage && "has-[[data-slot='command-group'][hidden]]:hidden",
        className,
      )}
      {...props}
    >
      {loading && (
        <CommandPrimitive.Loading className="flex justify-center p-1">
          <Loader2 className="animate-spin" />
        </CommandPrimitive.Loading>
      )}
      {!loading && emptyMessage && (
        <CommandEmpty className="flex justify-center p-2">{emptyMessage}</CommandEmpty>
      )}
      {!loading && <CommandGroup>{children}</CommandGroup>}
    </CommandList>
  );
});
AutocompleteList.displayName = 'AutocompleteList';

const AutocompleteItem = React.forwardRef<
  React.ElementRef<typeof CommandItem>,
  { value: string; children: React.ReactNode } & React.ComponentProps<typeof CommandItem>
>(({ value, children, className, onMouseDown, onSelect, ...props }, ref) => {
  const { selectedValues, setSearchValue, setOpen, multiple, onValueChange } =
    useAutocompleteContext();

  const isSelected = selectedValues.includes(value);
  const searchValue = typeof children === 'string' ? children : value;

  const handleSelect = () => {
    if (multiple === true) {
      const newSelected = isSelected
        ? selectedValues.filter(item => item !== value)
        : [...selectedValues, value];

      onValueChange?.(newSelected);
    } else {
      onValueChange?.(value);
      setSearchValue(searchValue);
      setOpen(false);
    }
    onSelect?.(value);
  };

  return (
    <CommandItem
      ref={ref}
      data-slot="autocomplete-item"
      value={searchValue}
      onMouseDown={event => {
        event.preventDefault();
        event.stopPropagation();
        onMouseDown?.(event);
      }}
      onSelect={handleSelect}
      className={cn('flex w-full items-center gap-2', !isSelected && 'pl-8', className)}
      {...props}
    >
      {isSelected && <Check className="w-4 text-current" />}
      {children}
    </CommandItem>
  );
});
AutocompleteItem.displayName = 'AutocompleteItem';

export { Autocomplete, AutocompleteTrigger, AutocompleteList, AutocompleteItem };
