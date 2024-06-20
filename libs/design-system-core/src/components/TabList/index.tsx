import React from 'react';

import Button from '../Button';
import Text, { TextProps } from '../Text';

import { getColorClasses } from '../../utils';
import Stack from '../Stack';

export type TabListProps = {
  labels: string[];
  selected: number;
  customStyle?: string;
  tabListDivider?: boolean;
  labelTextVariant?: TextProps['variant'];
  onChange: (selectedIndex: number, previousIndex: number) => void;
};

/**
 * The TabList component organizes content into separate sections that are easy to navigate between
 * without the need to leave the current page. Switching from one tab to another reveals the content of that
 * tab while hiding the others.
 * @param labels - a list of tab labels
 * @param selected - the index number of the selected tab
 * @param customStyle - (optional) apply any other custom styles. Please use standard Tailwind CSS classes
 * @param tabListDivider - boolean (optional) whether to add a divider between tabs
 * @param labelTextVariant - (optional) for customizing the text variant of the label
 * @param onChange - handler that is called when clicking on a tab
 * @example
 * ```tsx
 *  <TabList
 *      labels={['Tab 1', 'Tab 2', 'Tab 3']}
 *      selected={0}
 *      onChange={onTabChange}
 *   />
 * ```
 **/
const TabList: React.FC<TabListProps> = ({
  labels,
  selected,
  tabListDivider,
  labelTextVariant,
  customStyle = '',
  onChange,
}) => {
  const baseStyle = 'group p-2';
  const activeStyle = `border-b ${getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'border',
  )}`;
  const hoverStyle = `hover:border-b ${getColorClasses(
    {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
    'hover:border',
  )}`;
  const tabListDividerStyle = tabListDivider
    ? `border-b ${getColorClasses({ light: 'grey8', dark: 'grey5' }, 'border')}`
    : '';

  return (
    <Stack customStyle={`grid grid-cols-${labels.length} ${tabListDividerStyle} ${customStyle}`}>
      {labels.map((label, index) => (
        <Button
          key={label}
          onClick={() => onChange(index, selected)}
          customStyle={`${baseStyle} ${hoverStyle} ${selected === index ? activeStyle : ''}`}
          plain
          data-testid="tablist-tab"
        >
          <Text
            variant={labelTextVariant ? labelTextVariant : getTabTextVariant(selected, index)}
            color={
              selected === index
                ? {
                    light: 'secondaryLight',
                    dark: 'secondaryDark',
                  }
                : 'grey7'
            }
            weight={selected === index ? 'bold' : 'normal'}
            align="center"
            customStyle={getColorClasses(
              {
                light: 'secondaryLight',
                dark: 'secondaryDark',
              },
              'group-hover:text',
            )}
          >
            {label}
          </Text>
        </Button>
      ))}
    </Stack>
  );
};

const getTabTextVariant = (selected: number, index: number) =>
  selected === index ? 'button-md' : 'body2';

export default TabList;
