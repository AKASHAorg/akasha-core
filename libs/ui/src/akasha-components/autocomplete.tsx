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
      | { multiple: true; onValueChange?: (value: string[]) => void }
      | { multiple?: false; onValueChange?: (value: string) => void }
    ) & {
      searchValue: string;
      open: boolean;
      emptyMessage: string;
      loading?: boolean;
      inputRef: React.MutableRefObject<HTMLInputElement | null>;
      selectedValues: string[];
      setSearchValue: React.Dispatch<React.SetStateAction<string>>;
      setOpen: React.Dispatch<React.SetStateAction<boolean>>;
      registerOption: (value: string, label: React.ReactNode) => void;
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
    | { multiple: true; value?: string[]; onValueChange?: (value: string[]) => void }
    | { multiple?: false; value?: string; onValueChange?: (value: string) => void }
  )
>(({ emptyMessage = '', loading = false, className, children, ...props }, ref) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState('');
  const [, setOptions] = React.useState<Record<string, React.ReactNode>>({});

  const registerOption = React.useCallback((value: string, label: React.ReactNode) => {
    setOptions(prev => ({ ...prev, [value]: label }));
  }, []);

  const getSelectedValues = React.useCallback((multiple: boolean, value?: string | string[]) => {
    if (multiple) return Array.isArray(value) ? value : [];
    return typeof value === 'string' ? [value] : [];
  }, []);

  return (
    <AutocompleteContext.Provider
      value={{
        ...props,
        searchValue,
        emptyMessage,
        open,
        selectedValues: getSelectedValues(props.multiple, props.value),
        loading,
        inputRef,
        setOpen,
        setSearchValue,
        registerOption,
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
>(({ asChild, ...props }, ref) => {
  const { searchValue, setSearchValue, setOpen, inputRef, multiple } = useAutocompleteContext();

  const Comp = asChild ? (Slot as typeof Input) : Input;

  const handleBlur = React.useCallback(() => {
    setOpen(false);
    if (!multiple) {
      setSearchValue(searchValue || '');
    }
  }, [setOpen, setSearchValue, searchValue, multiple]);

  return (
    <Comp
      data-slot="autocomplete-trigger"
      ref={node => {
        inputRef.current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else {
          ref.current = node;
        }
      }}
      value={searchValue}
      type="search"
      onChange={event => {
        setSearchValue(event.target.value);
        setOpen(true);
      }}
      onFocus={() => setOpen(true)}
      onBlur={handleBlur}
      {...props}
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
        { hidden: !open },
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
  const { selectedValues, setSearchValue, setOpen, registerOption, multiple, onValueChange } =
    useAutocompleteContext();

  React.useEffect(() => {
    registerOption(value, children);
  }, [value, children, registerOption]);

  const isSelected = selectedValues.includes(value);
  const searchValue = typeof children === 'string' ? children : value;

  const handleSelect = () => {
    if (multiple) {
      const newSelected = isSelected
        ? selectedValues.filter(item => item !== value)
        : [...selectedValues, value];
      onValueChange?.(newSelected);
      return;
    } else {
      //TODO: revisit type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onValueChange?.(value as any);
      setSearchValue(searchValue);
      setOpen(false);
    }
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
      onSelect={value => {
        handleSelect();
        onSelect?.(value);
      }}
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
