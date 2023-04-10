import React, { Children, Fragment, PropsWithChildren, useState } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import Text from '../Text';
import { tw } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';

export type TabProps = {
  labels: string[];
  activeTab?: number;
  borderBottom?: boolean;
  onChange?: (selectedIndex: number) => void;
};

const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  labels,
  activeTab,
  borderBottom,
  onChange,
  children,
}) => {
  const [selectedIndex, changeSelectedIndex] = useState(activeTab || 0);
  const borderBottomStyle = borderBottom
    ? `border-b ${getColorClasses(
        {
          light: 'grey8',
          dark: 'grey5',
        },
        'border',
      )}`
    : '';

  const baseStyle = `group pb-3 ${borderBottomStyle}`;
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
  const onTabChange = (selectedIndex: number) => {
    changeSelectedIndex(selectedIndex);
    if (onChange) onChange(selectedIndex);
  };

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <div className={tw(`grid grid-cols-${labels.length}`)}>
        {labels.map((label, index) => (
          <Button
            key={index}
            onClick={() => onTabChange(index)}
            customStyle={`${baseStyle} ${hoverStyle} ${selectedIndex === index ? activeStyle : ''}`}
            plain
          >
            <Text
              variant={selectedIndex === index ? 'button-sm' : 'footnotes2'}
              color={
                selectedIndex === index
                  ? {
                      light: 'secondaryLight',
                      dark: 'secondaryDark',
                    }
                  : 'grey7'
              }
              weight={selectedIndex === index ? 'bold' : 'normal'}
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

      {Children.toArray(children)
        .slice(0, labels.length)
        .map((child, index) => (
          <Fragment key={index}>{index === selectedIndex && child}</Fragment>
        ))}
    </Stack>
  );
};

export default Tab;
