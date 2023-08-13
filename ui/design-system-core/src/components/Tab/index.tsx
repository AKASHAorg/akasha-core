import React, { Children, Fragment, PropsWithChildren } from 'react';
import { apply, tw } from '@twind/core';

import Stack from '../Stack';
import TabList from '../TabList';
import { TextProps } from '../Text';

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
  customStyle = '',
  bodyStyle,
  onChange,
}) => {
  return (
    <Stack direction="column" spacing="gap-y-4" customStyle={customStyle} fullWidth>
      <TabList
        labels={labels}
        selected={value}
        tabListDivider={tabListDivider}
        labelTextVariant={labelTextVariant}
        onChange={onChange}
      />
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
