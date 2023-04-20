import React, { Children, Fragment, PropsWithChildren, useState } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { apply, tw } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';

export type TabProps = {
  labels: string[];
  activeTab?: number;
  borderBottom?: boolean;
  labelTextVariant?: TextProps['variant'];
  customStyle?: string;
  bodyStyle?: string;
  onChange?: (selectedIndex: number, previousIndex: number) => void;
};

const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  labels,
  labelTextVariant,
  activeTab,
  children,
  customStyle,
  bodyStyle,
  onChange,
}) => {
  const [selectedIndex, changeSelectedIndex] = useState(activeTab || 0);

  const onTabChange = (selectedIndex: number, previousIndex: number) => {
    changeSelectedIndex(selectedIndex);
    if (onChange) onChange(selectedIndex, previousIndex);
  };

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

  const getSelectedTabVariant = (index: number) =>
    selectedIndex === index ? 'button-sm' : 'footnotes2';

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle} fullWidth>
      <div className={tw(`grid grid-cols-${labels.length}`)}>
        {labels.map((label, index) => (
          <Button
            key={index}
            onClick={() => onTabChange(index, selectedIndex)}
            customStyle={`${baseStyle} ${hoverStyle} ${selectedIndex === index ? activeStyle : ''}`}
            plain
          >
            <Text
              variant={labelTextVariant ? labelTextVariant : getSelectedTabVariant(index)}
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
          <Fragment key={index}>
            {index === selectedIndex && <div className={tw(apply`${bodyStyle}`)}>{child}</div>}
          </Fragment>
        ))}
    </Stack>
  );
};

export default Tab;
