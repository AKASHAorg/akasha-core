import React, { LegacyRef, forwardRef } from 'react';
import Stack from '../Stack';
import Text from '../Text';
import Icon from '../Icon';
import Card from '../Card';
import Button from '../Button';
import { IconType } from '@akashaorg/typings/ui';
import { TextProps } from '../Text';
import { getColorClasses } from '../../utils/getColorClasses';

export type Action = {
  label: string;
  icon?: IconType;
  onClick: (index: number) => void;
} & TextProps;

export type ActionDropdownProps = {
  actions: Action[];
  customStyle?: string;
  //show divider between drop down items
  showDivider?: boolean;
  ref?: LegacyRef<HTMLDivElement>;
};

const ActionDropdown: React.FC<ActionDropdownProps> = forwardRef(
  ({ actions, customStyle, showDivider = true }, ref) => {
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
          {actions.map((action, index) => (
            <Button
              key={action.label + index}
              customStyle={`${baseStyle} ${hoverStyle} first:rounded-t-lg	last:rounded-b-lg`}
              onClick={() => action.onClick(index)}
              plain
            >
              <Stack align="center" spacing="gap-x-3" customStyle="py-2 px-4">
                {action.icon && <Icon type={action.icon} color={action.color} size="sm" />}
                <Text variant="body1" {...action}>
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
