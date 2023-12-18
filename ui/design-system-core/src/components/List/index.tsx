import React, { Fragment, LegacyRef, forwardRef } from 'react';
import Card from '../Card';
import Stack from '../Stack';
import Tooltip from '../Tooltip';
import ListElement from './list-element';
import { getColorClasses } from '../../utils';
import { TextProps } from '../Text';

type Selected = { index: number; label?: string };

export type ListItem = {
  label: string;
  icon?: React.ReactElement;
  toolTipContent?: string;
  disabled?: boolean;
  onClick?: (label?: string) => void;
} & TextProps;

export type ListProps = {
  items: ListItem[];
  showDivider?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
  customStyle?: string;
  onSelected?: ({ index, label }: Selected) => void;
};

const List: React.FC<ListProps> = forwardRef(
  ({ items, showDivider = true, customStyle = '', onSelected }, ref) => {
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
      <Card radius={8} padding={0} customStyle={customStyle} ref={ref}>
        <Stack direction="column">
          {items.map((item, index) => (
            <Fragment key={index}>
              {item.toolTipContent ? (
                <Tooltip placement="left" content={item.toolTipContent}>
                  <ListElement
                    {...item}
                    onClick={handleItemClick(item, index)}
                    customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
                  />
                </Tooltip>
              ) : (
                <ListElement
                  {...item}
                  onClick={handleItemClick(item, index)}
                  customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
                />
              )}
            </Fragment>
          ))}
        </Stack>
      </Card>
    );
  },
);

export default List;
