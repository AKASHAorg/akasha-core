'use client';

import React, { forwardRef, useCallback, useRef, useState, type KeyboardEvent } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Check } from 'lucide-react';

import { cn } from '@/library/utils';

import { CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/command';
import { Skeleton } from '@/components/skeleton';

export type Option = Record<'value' | 'label', string>;

type AutoCompleteProps = {
  options: Option[];
  emptyMessage: string;
  isLoading?: boolean;
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

export const Autocomplete = forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  AutoCompleteProps
>(
  (
    { options, emptyMessage, disabled, isLoading = false, placeholder, className, ...props },
    ref,
  ) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isOpen, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState<string>('');

    const handleKeyDown = useCallback(
      (event: KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (!input) {
          return;
        }

        // Keep the options displayed when the user is typing
        if (!isOpen) {
          setOpen(true);
        }

        // This is not a default behaviour of the <input /> field
        if (event.key === 'Enter' && input.value !== '') {
          const optionToSelect = options.find(option => option.label === input.value);
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
      [isOpen, options, props],
    );

    const handleBlur = useCallback(() => {
      setOpen(false);
      if (props.multiple === false) {
        setInputValue(props.value?.label || '');
      }
    }, [props.value, props.multiple]);

    const handleSelectOption = useCallback(
      (selectedOption: Option) => {
        if (props.multiple === true) {
          const isSelected = props.value?.some(option => option.value === selectedOption.value);

          const newSelected = isSelected
            ? props.value?.filter(option => option.value !== selectedOption.value) || []
            : [...(props.value || []), selectedOption];

          setInputValue('');
          props.onValueChange?.(newSelected);
        } else {
          setInputValue(selectedOption.label);
          props.onValueChange?.(selectedOption);

          setTimeout(() => {
            inputRef?.current?.blur();
          }, 0);
        }
      },
      [props],
    );

    return (
      <CommandPrimitive ref={ref} onKeyDown={handleKeyDown}>
        <div className={cn('border rounded-[0.5rem]', className)}>
          <CommandInput
            ref={inputRef}
            value={inputValue}
            onValueChange={isLoading ? undefined : setInputValue}
            onBlur={handleBlur}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            disabled={disabled}
            className="text-base"
          />
        </div>
        <div className="relative mt-1">
          <div
            className={cn(
              'animate-in fade-in-0 zoom-in-95 absolute top-0 z-10 w-full rounded-xl bg-background outline-none',
              isOpen ? 'block' : 'hidden',
            )}
          >
            <CommandList className="rounded-[0.5rem] ring-1 ring-muted">
              {isLoading ? (
                <CommandPrimitive.Loading>
                  <div className="p-1">
                    <Skeleton className="h-8 w-full" />
                  </div>
                </CommandPrimitive.Loading>
              ) : null}
              {options.length > 0 && !isLoading ? (
                <CommandGroup>
                  {options.map(option => {
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
                        className={cn(
                          'flex w-full items-center gap-2',
                          !isSelected ? 'pl-8' : null,
                        )}
                      >
                        {isSelected ? <Check className="w-4" /> : null}
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              ) : null}
              {!isLoading ? (
                <CommandPrimitive.Empty className="select-none rounded-[0.25rem] px-2 py-3 text-center text-sm">
                  {emptyMessage}
                </CommandPrimitive.Empty>
              ) : null}
            </CommandList>
          </div>
        </div>
      </CommandPrimitive>
    );
  },
);
