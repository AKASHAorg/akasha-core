import React, { LegacyRef, forwardRef } from 'react';
import Stack from '../Stack';
import Text from '../Text';
import Icon from '../Icon';
import Card from '../Card';
import Button from '../Button';
import { IconType } from '@akashaorg/typings/ui';
import { TextProps } from '../Text';
import { getColorClasses } from '../../utils/getColorClasses';

export type Item = {
  label: string;
  icon?: IconType;
  onClick: (index: number) => void;
} & TextProps;

export type ListProps = {
  items: Item[];
  customStyle?: string;
  showDivider?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
};

const List: React.FC<ListProps> = forwardRef(({ items, customStyle, showDivider = true }, ref) => {
  const borderStyle = showDivider
    ? `border-b ${getColorClasses(
        {
          light: 'grey8',
          dark: 'grey3',
        },
        'border',
      )}`
    : '';
  const baseStyle = `${borderStyle}`;
  const hoverStyle = `${getColorClasses({ light: 'grey8', dark: 'grey5' }, 'hover:bg')}`;

  return (
    <Card elevation="1" radius={8} customStyle={`z-50	w-fit ${customStyle}`} ref={ref}>
      <Stack direction="column">
        {items.map((item, index) => (
          <Button
            key={item.label + index}
            customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
            onClick={() => item.onClick(index)}
            plain
          >
            <Stack align="center" spacing="gap-x-3" customStyle="py-2 px-4">
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
});

export default List;
