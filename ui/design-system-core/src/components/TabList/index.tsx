import React from 'react';
import { apply, tw } from '@twind/core';

import Button from '../Button';
import Text, { TextProps } from '../Text';

import { getColorClasses } from '../../utils';

export type TabListProps = {
  labels: string[];
  selected: number;
  tabListDivider?: boolean;
  labelTextVariant?: TextProps['variant'];
  onChange: (selectedIndex: number, previousIndex: number) => void;
};

const TabList: React.FC<TabListProps> = ({
  labels,
  selected,
  tabListDivider,
  labelTextVariant,
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
    <div className={tw(apply`grid grid-cols-${labels.length} ${tabListDividerStyle}`)}>
      {labels.map((label, index) => (
        <Button
          key={index}
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
    </div>
  );
};

const getTabTextVariant = (selected: number, index: number) =>
  selected === index ? 'button-sm' : 'footnotes2';

export default TabList;
