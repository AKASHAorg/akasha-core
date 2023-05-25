import * as React from 'react';
import { apply, tw, tx } from '@twind/core';
import { IconType } from '@akashaorg/typings/ui';
import Box from '@akashaorg/design-system-core/lib/components/Box';
import Divider from '@akashaorg/design-system-core/lib/components/Divider';
import Icon from '@akashaorg/design-system-core/lib/components/Icon';
import Text from '@akashaorg/design-system-core/lib/components/Text';

export type DropdownMenuItemGroupType = {
  id: string;
  title: string;
  iconName?: IconType;
  type?: 'optgroup' | 'opt';
  children?: DropdownMenuItemGroupType[];
};

export type IDropdownProps = {
  name?: string;
  label?: string;
  placeholderLabel?: string;
  selected: DropdownMenuItemGroupType;
  menuItems: DropdownMenuItemGroupType[] | DropdownMenuItemGroupType[];
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
  divider?: boolean;
  optgroup?: boolean;
};

const Dropdown: React.FC<IDropdownProps> = ({
  label,
  placeholderLabel,
  menuItems,
  // selected,
  // setSelected,
  divider = false,
  optgroup = false,
}) => {
  const [dropOpen, setDropOpen] = React.useState<boolean>(false);
  const [selected, setSelected] = React.useState<null | DropdownMenuItemGroupType>(null);

  React.useEffect(() => {
    if (placeholderLabel) {
      setSelected({
        id: '',
        iconName: null,
        title: placeholderLabel ?? (optgroup ? menuItems[0].children[0].title : menuItems[0].title),
      });
    } else {
      optgroup ? setSelected(menuItems[0].children[0]) : setSelected(menuItems[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const optionsWrapperStyle = apply`absolute w-full z-10 max-h-60 mt-1 py-0 rounded-lg overflow-auto bg-(white dark:grey3) border(1 grey8 dark:grey5)`;

  const optionStyle = apply`flex items-center justify-between p-3 bg-(hover:grey8 dark:hover:grey3)`;

  const handleDropClick = () => {
    setDropOpen(!dropOpen);
  };

  const handleChange = (menuItem: DropdownMenuItemGroupType) => () => {
    setSelected(menuItem);
    setDropOpen(!dropOpen);
  };

  return (
    <Box customStyle="relative w-full">
      {label && <Text variant="label">{label}</Text>}

      <button
        className={tx`inline-flex items-center justify-between w-full p-3 rounded-lg bg-(white dark:grey3) rounded-lg border-(1 solid ${
          dropOpen ? 'secondaryLight dark:secondark-dark' : 'grey8 dark:grey3'
        })`}
        onClick={handleDropClick}
      >
        <Text variant="body1">{selected?.title}</Text>
        {dropOpen ? (
          <Icon type="ChevronUpIcon" customStyle="ml-4" />
        ) : (
          <Icon type="ChevronDownIcon" customStyle="ml-4" />
        )}
      </button>

      {/* <!-- Dropdown menu --> */}
      {dropOpen && (
        <Box customStyle={optionsWrapperStyle}>
          <ul aria-labelledby="dropdownDefaultButton">
            {menuItems.map((menuItem, idx) => {
              const isSelected = selected?.id === menuItem.id;
              if (optgroup) {
                if (menuItem.type === 'optgroup') {
                  return (
                    <>
                      <Box customStyle={`flex items-center pt-3 pl-3`} key={menuItem.id}>
                        <Text
                          variant="body2"
                          customStyle="cursor-not-allowed"
                          color={{ light: 'grey5', dark: 'grey8' }}
                        >
                          {menuItem.title}
                        </Text>
                      </Box>
                      {menuItem?.children &&
                        menuItem.children.map((item, idx) => {
                          return (
                            <li
                              key={item.id}
                              className={tw(
                                `${optionStyle}
                                // $ {
                                //   idx < menuItem.children.length - 1
                                //     ? 'border-b(1 grey8 dark:grey3)'
                                //     : ''
                                // }
                                cursor-pointer`,
                              )}
                              onClick={handleChange(item)}
                            >
                              <Box
                                customStyle={`flex items-center space-x-2 ${
                                  selected.id === item.id ? 'text-secondaryLight' : 'text-black'
                                }`}
                              >
                                {item?.iconName && (
                                  <Icon
                                    type={item.iconName}
                                    color={
                                      selected.id === item.id
                                        ? { light: 'secondaryLight', dark: 'secondaryDark' }
                                        : { light: 'black', dark: 'white' }
                                    }
                                  />
                                )}
                                <Text
                                  variant="body1"
                                  color={
                                    selected.id === item.id
                                      ? { light: 'secondaryLight', dark: 'secondaryDark' }
                                      : { light: 'black', dark: 'white' }
                                  }
                                >
                                  {item.title}
                                </Text>
                              </Box>
                            </li>
                          );
                        })}
                      {divider && <Divider />}
                    </>
                  );
                } else {
                  return (
                    <li
                      key={menuItem.id}
                      className={tw(
                        `${optionStyle}
                        ${idx < menuItems.length - 1 ? 'border-b(1 grey8 dark:grey5)' : ''}
                        cursor-pointer`,
                      )}
                      onClick={handleChange(menuItem)}
                    >
                      <Box
                        customStyle={`flex items-center space-x-2 ${
                          isSelected ? 'text-secondaryLight' : 'text-black'
                        }`}
                      >
                        {menuItem?.iconName && (
                          <Icon
                            type={menuItem.iconName}
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
                      </Box>
                    </li>
                  );
                }
              } else {
                return (
                  <li
                    key={menuItem.id}
                    className={tw(
                      `${optionStyle} ${
                        idx < menuItems.length - 1 ? 'border-b(1 grey8 dark:grey3)' : ''
                      } cursor-pointer`,
                    )}
                    onClick={handleChange(menuItem)}
                  >
                    <Box
                      customStyle={`flex items-center space-x-2 ${
                        isSelected ? 'text-secondaryLight' : 'text-black'
                      }`}
                    >
                      {menuItem?.iconName && (
                        <Icon
                          type={menuItem.iconName}
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
                    </Box>
                    {isSelected && (
                      <span className={tw('ml-4')}>
                        <Icon
                          type="CheckIcon"
                          color={{ light: 'secondaryLight', dark: 'secondaryDark' }}
                        />
                      </span>
                    )}
                  </li>
                );
              }
            })}
          </ul>
        </Box>
      )}
    </Box>
  );
};

export default Dropdown;
