import React, { LegacyRef, forwardRef } from 'react';
import Stack from '../Stack';
import Text from '../Text';
import Icon from '../Icon';
import Card from '../Card';
import Button from '../Button';
import { IconType } from '@akashaorg/typings/ui';
import { TextProps } from '../Text';
import { getColorClasses } from '../../utils/getColorClasses';

type Action = {
  label: string;
  icon: IconType;
  color?: TextProps['color'];
  onClick: (event: React.SyntheticEvent<Element, Event>) => void;
};

export type ActionDropdownProps = {
  actions: Action[];
  customStyle?: string;
  ref?: LegacyRef<HTMLDivElement>;
};

const ActionDropdown: React.FC<ActionDropdownProps> = forwardRef(
  ({ actions, customStyle }, ref) => {
    const baseStyle = `border-b ${getColorClasses({
      light: 'border-grey8',
      dark: 'border-grey3',
    })}`;
    const hoverStyle = `${getColorClasses({ light: 'grey8', dark: 'grey5' }, 'hover:bg')}`;

    return (
      <Card elevation="1" radius={8} customStyle={`w-fit ${customStyle}`} ref={ref}>
        <Stack direction="column">
          {actions.map((action, index) => (
            <Button
              key={action.label + index}
              customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
              onClick={action.onClick}
              plain
            >
              <Stack align="center" spacing="gap-x-3 py-2 px-4">
                <Icon type={action.icon} color={action.color} size="sm" />
                <Text variant="body1" color={action.color}>
                  {action.label}
                </Text>
              </Stack>
            </Button>
          ))}
        </Stack>
      </Card>
    );
  },
);

export default ActionDropdown;
