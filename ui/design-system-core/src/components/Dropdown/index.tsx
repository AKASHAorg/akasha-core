import * as React from 'react';
import Icon from '../Icon';
import Text from '../Text';
import { cx, tw, tx } from '@twind/core';
import { Listbox, Transition } from '@headlessui/react';
import { IconType } from '@akashaorg/typings/ui';

export interface IDropdownProps {
  name: string;
  menuItems: { id: string; item: { iconName: IconType; title: string } }[];
  label?: string;
  defaultSelectorLabel?: string;
  onChange?: (e: { iconName?: IconType; title: string }) => void;
}

const Dropdown: React.FC<IDropdownProps> = ({
  name,
  menuItems,
  label = '',
  defaultSelectorLabel = 'Select an Option',
  onChange,
}) => {
  const [selected, setSelected] = React.useState({ iconName: null, title: defaultSelectorLabel });

  const listButtonStyle = cx`
      relative w-full cursor-default rounded-lg
      bg-white dark:bg-grey5
      py-2 pl-3 pr-10 text-left
  `;

  const listButtonRightIconStyle = cx`
      pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2
      `;

  const optionListStyle = cx`
      absolute mt-1 max-h-60 w-full overflow-auto rounded-md
      bg-white dark:bg-grey5
      py-0 text-base sm:text-sm
      border([1px] grey8) dark:border([1px] grey3)
      `;

  const optionStyle = cx`
      relative py-2 pl-5 pr-4
      border-b([1px] grey8) hover:bg-grey8 dark:(border-b([1px] grey3) hover:bg-grey5)
      `;

  return (
    <div className={tx('w-full min-[426px]:w-80 py-2')}>
      {label && <Text variant="label">{label}</Text>}
      <Listbox
        name={name}
        value={selected}
        onChange={e => {
          if (onChange !== undefined) {
            onChange(e);
          }
          setSelected(e);
        }}
      >
        {({ open }) => (
          <div className="relative mt-1">
            <Listbox.Button
              className={tx(`${listButtonStyle}
              ${open ? 'border([1px] secondary-light)' : 'border([1px] grey8)'}`)}
            >
              <div className={tx`flex items-center space-x-2`}>
                {selected.iconName && <Icon type={selected.iconName} />}
                <Text variant="body1">{selected.title}</Text>
              </div>
              <span className={tw(listButtonRightIconStyle)}>
                {open ? <Icon type="ChevronUpIcon" /> : <Icon type="ChevronDownIcon" />}
              </span>
            </Listbox.Button>
            <Transition
              as={React.Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className={tw(optionListStyle)}>
                {menuItems.map((menuItem, idx) => (
                  <Listbox.Option key={idx} className={tw(optionStyle)} value={menuItem.item}>
                    {({ selected }) => (
                      <>
                        <div
                          className={tx`flex items-center space-x-2  ${
                            selected ? 'text-secondary-light' : 'text-black'
                          }`}
                        >
                          <Icon
                            type={menuItem.item.iconName}
                            color={
                              selected
                                ? { light: 'secondary-light', dark: 'secondary-dark' }
                                : { light: 'black', dark: 'white' }
                            }
                          />
                          <Text
                            variant="body1"
                            color={
                              selected
                                ? { light: 'text-secondary-light', dark: 'text-secondary-dark' }
                                : { light: 'text-black', dark: 'text-white' }
                            }
                          >
                            {menuItem.item.title}
                          </Text>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 right-2 flex items-center pl-3">
                            <Icon
                              type="CheckIcon"
                              color={{ light: 'secondary-light', dark: 'secondary-dark' }}
                            />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        )}
      </Listbox>
    </div>
  );
};

export default Dropdown;
