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
    ? `border-b ${getColorClasses({
        light: 'border-grey8',
        dark: 'border-grey5',
      })}`
    : '';

  const baseStyle = `group pb-3 ${borderBottomStyle}`;
  const activeStyle = `border-b ${getColorClasses({
    light: 'border-secondary-light',
    dark: 'border-secondary-dark',
  })}`;
  const hoverStyle = `hover:border-b ${getColorClasses(
    {
      light: 'secondary-light',
      dark: 'secondary-dark',
    },
    'hover:border',
  )}`;

  const onTabChange = (selectedIndex: number) => {
    changeSelectedIndex(selectedIndex);
    onChange(selectedIndex);
  };

  return (
    <Stack direction="column" spacing="gap-y-4" fullWidth>
      <div className={tw(`grid grid-cols-${labels.length}`)}>
        {labels.map((label, index) => (
          <Button
            key={label}
            onClick={() => onTabChange(index)}
            className={tw(
              `${baseStyle} ${hoverStyle}	${selectedIndex === index ? activeStyle : ''}`,
            )}
            plain
          >
            <Text
              variant={selectedIndex === index ? 'button-sm' : 'footnotes2'}
              color={
                selectedIndex === index
                  ? {
                      light: 'text-secondary-light',
                      dark: 'text-secondary-dark',
                    }
                  : 'text-grey7'
              }
              weight={selectedIndex === index ? 'bold' : 'normal'}
              align="center"
              customStyle={getColorClasses(
                {
                  light: 'secondary-light',
                  dark: 'secondary-dark',
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
          <Fragment key={labels[index]}>{index === selectedIndex && child}</Fragment>
        ))}
    </Stack>
  );
};

export default Tab;
