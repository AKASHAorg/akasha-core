import * as React from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check, Loader2 } from 'lucide-react';

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

export type Option = Record<'value' | 'label', string>;

type AutoCompleteProps = {
  options: Option[] | null;
  emptyMessage: string;
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
} & (
  | {
      multiple: true;
      value?: Option[];
      onValueChange?: (value: Option[]) => void;
    }
  | {
      multiple?: false;
      value?: Option;
      onValueChange?: (value: Option) => void;
    }
);

const Autocomplete = ({
  options = [],
  emptyMessage,
  disabled,
  loading = false,
  placeholder,
  className,
  ...props
}: AutoCompleteProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const [typing, setTyping] = React.useState(false);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (!input) {
        return;
      }

      if (!open) {
        setOpen(true);
      }

      if (event.key === 'Enter' && input.value !== '') {
        const optionToSelect = options?.find(option => option.label === input.value);
        if (optionToSelect) {
          if (props.multiple === true) {
            const newSelected = [...(props.value || []), optionToSelect];
            props.onValueChange?.(newSelected);
          } else {
            props.onValueChange?.(optionToSelect);
          }
        }
      }

      if (event.key === 'Escape') {
        input.blur();
      }
    },
    [open, options, props],
  );

  const handleBlur = React.useCallback(() => {
    setOpen(false);
    if (props.multiple === false) {
      setValue(props.value?.label || '');
    }
  }, [props.value, props.multiple]);

  const handleSelectOption = React.useCallback(
    (selectedOption: Option) => {
      if (props.multiple === true) {
        const isSelected = props.value?.some(option => option.value === selectedOption.value);

        const newSelected = isSelected
          ? props.value?.filter(option => option.value !== selectedOption.value) || []
          : [...(props.value || []), selectedOption];

        setValue('');
        props.onValueChange?.(newSelected);
      } else {
        setValue(selectedOption.label);
        props.onValueChange?.(selectedOption);

        setTimeout(() => {
          inputRef?.current?.blur();
        }, 0);
      }
      setTyping(true);
    },
    [props],
  );

  return (
    <Command
      data-slot="autocomplete"
      onKeyDown={handleKeyDown}
      className={cn(
        'flex flex-col gap-2 bg-transparent rounded-lg text-sm **:data-[slot=command-input-wrapper]:hidden overflow-visible',
        className,
      )}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={event => {
          setValue(event.target.value);
          setTyping(true);
        }}
        onBlur={handleBlur}
        onFocus={() => {
          setOpen(true);
          setTyping(false);
        }}
        placeholder={placeholder}
        type="search"
        disabled={disabled}
      />
      <div className="hidden">
        <CommandInput value={typing ? value : ''} />
      </div>
      <div className="relative">
        <CommandList
          className={cn(
            'absolute animate-in fade-in-0 zoom-in-95 z-10 w-full border rounded-lg bg-card p-1',
            {
              hidden: !open,
            },
          )}
        >
          {!loading && (
            <CommandEmpty className="flex justify-center p-2">{emptyMessage}</CommandEmpty>
          )}
          {loading && (
            <CommandPrimitive.Loading className="flex justify-center p-1">
              <Loader2 className="animate-spin" />
            </CommandPrimitive.Loading>
          )}
          {(options || []).length > 0 && !loading && (
            <CommandGroup>
              {options?.map(option => {
                const isSelected =
                  props.multiple === true
                    ? props.value?.some(item => item.value === option.value)
                    : props.value?.value === option.value;

                return (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onMouseDown={event => {
                      event.preventDefault();
                      event.stopPropagation();
                    }}
                    onSelect={() => handleSelectOption(option)}
                    className={cn('flex w-full items-center gap-2', !isSelected ? 'pl-8' : null)}
                  >
                    {isSelected ? <Check className="w-4 text-current" /> : null}
                    {option.label}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </div>
    </Command>
  );
};

export { Autocomplete };
