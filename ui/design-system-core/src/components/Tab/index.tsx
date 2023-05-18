import React, { Children, Fragment, PropsWithChildren } from 'react';
import Button from '../Button';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';
import { apply, tw } from '@twind/core';
import { getColorClasses } from '../../utils/getColorClasses';

export type TabProps = {
  value: number;
  labels: string[];
  tabListDivider?: boolean;
  labelTextVariant?: TextProps['variant'];
  customStyle?: string;
  bodyStyle?: string;
  onChange: (selectedIndex: number, previousIndex: number) => void;
};

const Tab: React.FC<PropsWithChildren<TabProps>> = ({
  value,
  labels,
  tabListDivider,
  labelTextVariant,
  children,
  customStyle,
  bodyStyle,
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
  const getSelectedTabVariant = (index: number) => (value === index ? 'button-sm' : 'footnotes2');

  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle} fullWidth>
      <div className={tw(apply`grid grid-cols-${labels.length} ${tabListDividerStyle}`)}>
        {labels.map((label, index) => (
          <Button
            key={index}
            onClick={() => onChange(index, value)}
            customStyle={`${baseStyle} ${hoverStyle} ${value === index ? activeStyle : ''}`}
            plain
          >
            <Text
              variant={labelTextVariant ? labelTextVariant : getSelectedTabVariant(index)}
              color={
                value === index
                  ? {
                      light: 'secondaryLight',
                      dark: 'secondaryDark',
                    }
                  : 'grey7'
              }
              weight={value === index ? 'bold' : 'normal'}
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
            {index === value && <div className={tw(apply`${bodyStyle}`)}>{child}</div>}
          </Fragment>
        ))}
    </Stack>
  );
};
export default Tab;
