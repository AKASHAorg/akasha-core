import * as React from 'react';
import { useCloseActions } from '@akashaorg/design-system-core/lib/utils';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Separator } from '@akashaorg/ui/lib/components/separator';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
export type DropdownMenuItemGroupType = {
  id: string;
  title: string;
  altTitle?: string;
  icon?: React.ReactElement;
  type?: 'optgroup' | 'opt';
  children?: DropdownMenuItemGroupType[];
};
export type IDropdownFilterProps = {
  name?: string;
  label?: string;
  placeholderLabel?: string;
  selected: DropdownMenuItemGroupType;
  menuItems: DropdownMenuItemGroupType[] | DropdownMenuItemGroupType[];
  setSelected: React.Dispatch<React.SetStateAction<DropdownMenuItemGroupType>>;
  divider?: boolean;
  optgroup?: boolean;
  customStyle?: string;
  padding?: string;
};

/**
 * Base dropdown filter
 */
const DropdownFilter: React.FC<IDropdownFilterProps> = ({
  label,
  placeholderLabel,
  menuItems,
  selected,
  setSelected,
  divider = false,
  optgroup = false,
  customStyle,
  padding = 'p-3',
}) => {
  const [dropOpen, setDropOpen] = React.useState<boolean>(false);
  React.useEffect(() => {
    if (placeholderLabel) {
      setSelected({
        id: '0',
        icon: null,
        title: placeholderLabel,
      });
    } else {
      menuItems[0]?.children ? setSelected(menuItems[0].children[0]) : setSelected(menuItems[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const optionsWrapperStyle = `absolute z-10 max-h-60 mt-14 py-0 rounded-[0.5rem] overflow-auto bg-white dark:bg-grey3 border-1 border-grey8 dark:border-grey5`;
  const optionStyle = `flex items-center justify-between p-3 hover:bg-grey8 dark:hover:bg-grey3`;
  const handleDropClick = () => {
    setDropOpen(!dropOpen);
  };
  const anchorRef = useCloseActions(() => {
    setDropOpen(false);
  });
  const handleChange = (menuItem: DropdownMenuItemGroupType) => () => {
    setSelected(menuItem);
    setDropOpen(!dropOpen);
  };
  return (
    <Stack ref={anchorRef} direction="row" className="w-full relative">
      {label && <Typography className="font-medium">{label}</Typography>}

      <button
        className={`inline-flex items-center justify-between w-full ${padding} rounded-[0.5rem] bg-white dark:bg-grey3 rounded-[0.5rem] border-1 border-solid ${dropOpen ? 'border-secondaryLight dark:border-secondaryDark' : 'border-grey8 dark:border-grey3'} ${customStyle}`}
        onClick={handleDropClick}
      >
        <Typography>{selected?.altTitle || selected?.title}</Typography>
        {dropOpen ? (
          <ChevronUpIcon className="h-5 w-5 ml-4" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 ml-4" />
        )}
      </button>

      {/* <!-- Dropdown menu --> */}
      {dropOpen && (
        <Stack direction="row" className={optionsWrapperStyle}>
          <ul aria-labelledby="dropdownDefaultButton" className="w-full">
            {menuItems.map((menuItem, idx) => {
              const isSelected = selected?.id === menuItem.id;
              if (optgroup) {
                if (menuItem.type === 'optgroup') {
                  return (
                    <>
                      <Stack direction="row" alignItems="center" key={idx} className="pt-3 pl-3">
                        <Typography
                          variant="sm"
                          className="cursor-not-allowed text-grey5 dark:text-grey8"
                        >
                          {menuItem.title}
                        </Typography>
                      </Stack>
                      {menuItem?.children &&
                        menuItem.children.map((item, idx) => {
                          return (
                            <li
                              key={idx}
                              className={`${optionStyle}
                                // $ {
                                //   idx < menuItem.children.length - 1
                                //     ? 'border-b(1 grey8 dark:grey3)'
                                //     : ''
                                // }
                                cursor-pointer`}
                            >
                              <Card onClick={handleChange(item)} className="w-full border-none p-0">
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                  className={`w-full ${selected.id === item.id ? 'text-secondaryLight' : 'text-black'}`}
                                >
                                  {item.icon}
                                  <Typography>{item.title}</Typography>
                                </Stack>
                              </Card>
                            </li>
                          );
                        })}
                      {divider && <Separator />}
                    </>
                  );
                } else {
                  return (
                    <li
                      key={idx}
                      className={`${optionStyle}
                        ${idx < menuItems.length - 1 ? 'border-b-1 border-b-grey8 dark:border-b-grey5' : ''}
                        cursor-pointer`}
                    >
                      <button onClick={handleChange(menuItem)} className="w-full">
                        <Stack
                          direction="row"
                          alignItems="center"
                          spacing={2}
                          className={`w-full ${isSelected ? 'text-secondaryLight' : 'text-black'}`}
                        >
                          {menuItem.icon}
                          <Typography>{menuItem.title}</Typography>
                        </Stack>
                      </button>
                    </li>
                  );
                }
              } else {
                return (
                  <li
                    key={idx}
                    className={`${optionStyle} ${idx < menuItems.length - 1 ? 'border-b-1 border-b-grey8 dark:border-b-grey3' : ''} cursor-pointer`}
                  >
                    <Card onClick={handleChange(menuItem)} className="w-full border-none p-0">
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        className={`w-full ${isSelected ? 'text-secondaryLight' : 'text-black'}`}
                      >
                        {menuItem.icon}
                        <Typography>{menuItem.title}</Typography>
                        {isSelected && (
                          <span className={'ml-4'}>
                            <CheckIcon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />
                          </span>
                        )}
                      </Stack>
                    </Card>
                  </li>
                );
              }
            })}
          </ul>
        </Stack>
      )}
    </Stack>
  );
};
export default DropdownFilter;
