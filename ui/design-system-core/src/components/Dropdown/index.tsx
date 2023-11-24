import * as React from 'react';
import { apply, tw, tx } from '@twind/core';

import Stack from '../Stack';
import Icon from '../Icon';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '../Icon/hero-icons-outline';
import Text from '../Text';
import Anchor from '../Anchor';

export type DropdownMenuItemType = { id: string; icon?: React.ReactElement; title: string };

export type DropdownProps = {
  name?: string;
  label?: string;
  placeholderLabel?: string;
  selected?: DropdownMenuItemType;
  menuItems: DropdownMenuItemType[];
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemType>>;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  placeholderLabel,
  menuItems,
  selected,
  setSelected,
}) => {
  const [dropOpen, setDropOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (placeholderLabel) {
      setSelected({
        id: '',
        icon: null,
        title: placeholderLabel ?? menuItems[0].title,
      });
    } else {
      setSelected(selected ?? menuItems[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsWrapperStyle = apply`absolute w-full z-10 max-h-60 mt-12 py-0 rounded-lg overflow-auto bg-(white dark:grey5) border(1 grey8 dark:grey3)`;

  const optionStyle = apply`flex items-center justify-between p-3 bg-(hover:grey8 dark:hover:grey5)`;

  const handleDropClick = () => {
    setDropOpen(!dropOpen);
  };

  const handleChange = (menuItem: DropdownMenuItemType) => () => {
    setSelected(menuItem);
    setDropOpen(!dropOpen);
  };

  return (
    <Stack customStyle="relative min-w-[8rem]">
      {label && <Text variant="label">{label}</Text>}

      <button
        className={tx`inline-flex items-center justify-between min-w-[8rem] p-3 rounded-lg bg-(white dark:grey5) rounded-lg border-(1 solid ${
          dropOpen ? 'secondaryLight dark:secondark-dark' : 'grey8 dark:grey3'
        })`}
        onClick={handleDropClick}
        aria-label="dropdown"
      >
        <Text variant="body1">{selected?.title}</Text>
        {dropOpen ? (
          <Icon icon={<ChevronUpIcon />} customStyle="ml-4" />
        ) : (
          <Icon icon={<ChevronDownIcon />} customStyle="ml-4" />
        )}
      </button>

      {/* <!-- Dropdown menu --> */}
      {dropOpen && (
        <Stack customStyle={optionsWrapperStyle}>
          <ul aria-labelledby="dropdownDefaultButton">
            {menuItems.map((menuItem, idx) => {
              const isSelected = selected?.id === menuItem.id;
              return (
                <Anchor
                  key={menuItem.id}
                  tabIndex={-7}
                  className={tw(
                    `${optionStyle} ${
                      idx < menuItems.length - 1 ? 'border-b(1 grey8 dark:grey3)' : ''
                    } cursor-pointer`,
                  )}
                  onClick={handleChange(menuItem)}
                >
                  <Stack
                    align="center"
                    spacing="gap-x-2"
                    customStyle={`${isSelected ? 'text-secondaryLight' : 'text-black'}`}
                  >
                    {menuItem?.icon && (
                      <Icon
                        icon={menuItem.icon}
                        color={
                          isSelected
                            ? { light: 'secondaryLight', dark: 'secondaryDark' }
                            : { light: 'black', dark: 'white' }
                        }
                      />
                    )}
                    <Text
                      variant="body1"
                      color={
                        isSelected
                          ? { light: 'secondaryLight', dark: 'secondaryDark' }
                          : { light: 'black', dark: 'white' }
                      }
                    >
                      {menuItem.title}
                    </Text>
                  </Stack>
                  {isSelected && (
                    <span className={tw('ml-4')}>
                      <Icon
                        icon={<CheckIcon />}
                        color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                      />
                    </span>
                  )}
                </Anchor>
              );
            })}
          </ul>
        </Stack>
      )}
    </Stack>
  );
};

export default Dropdown;
