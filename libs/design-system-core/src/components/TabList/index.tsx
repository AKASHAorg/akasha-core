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
