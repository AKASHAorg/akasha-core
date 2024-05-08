import React from 'react';
import Stack from '../Stack';
import Text from '../Text';
import Icon from '../Icon';
import Button from '../Button';
import { ListItem } from '.';

export type ListItemProps = { customStyle?: string } & ListItem;

const ListElement: React.FC<ListItemProps> = props => {
  const { label, icon, color, disabled, customStyle = '', onClick, ...rest } = props;
  return (
    <Button
      customStyle={customStyle}
      onClick={() => {
        if (onClick) onClick(label);
      }}
      disabled={disabled}
      plain
    >
      <Stack direction="row" align="center" spacing="gap-x-1" customStyle="py-2 px-4">
        {icon && <Icon icon={icon} color={color} size="sm" />}
        <Text variant="body1" color={color} {...rest}>
          {label}
        </Text>
      </Stack>
    </Button>
  );
};

export default ListElement;
