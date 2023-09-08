import React, { LegacyRef, forwardRef } from 'react';

import { IconType } from '@akashaorg/typings/ui';

import Button from '../Button';
import Card from '../Card';
import Icon from '../Icon';
import Stack from '../Stack';
import Text, { TextProps } from '../Text';

import { getColorClasses } from '../../utils';

type Selected = { index: number; label?: string };

export type ListItem = {
  label: string;
  icon?: IconType;
  onClick?: (label?: string) => void;
} & TextProps;

export type ListProps = {
  items: ListItem[];
  customStyle?: string;
  showDivider?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
  onSelected?: ({ index, label }: Selected) => void;
};

const List: React.FC<ListProps> = forwardRef(
  ({ items, customStyle = '', showDivider = true, onSelected }, ref) => {
    const borderStyle = showDivider
      ? `border-b ${getColorClasses(
          {
            light: 'grey8',
            dark: 'grey3',
          },
          'border',
        )}`
      : '';
    const baseStyle = borderStyle;
    const hoverStyle = getColorClasses({ light: 'grey8', dark: 'grey5' }, 'hover:bg');

    const handleItemClick = (item: ListItem, index: number) => () => {
      if (item.onClick) {
        item.onClick(item.label);
      }
      if (onSelected) {
        onSelected({ index, label: item.label });
      }
    };

    return (
      <Card radius={8} padding={0} customStyle={`w-fit ${customStyle}`} ref={ref}>
        <Stack direction="column">
          {items.map((item, index) => (
            <Button
              key={item.label + index}
              customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
              onClick={handleItemClick(item, index)}
              plain
            >
              <Stack direction="row" align="center" spacing="gap-x-3" customStyle="py-2 px-4">
                {item.icon && <Icon type={item.icon} color={item.color} size="sm" />}
                <Text variant="body1" {...item}>
                  {item.label}
                </Text>
              </Stack>
            </Button>
          ))}
        </Stack>
      </Card>
    );
  },
);

export default List;
