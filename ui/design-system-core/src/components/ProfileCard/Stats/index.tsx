import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Button from '../../Button';
import Text, { TextProps } from '../../Text';
import { IconType } from '@akashaorg/typings/ui';
import AppIcon from '../../AppIcon';

type Stat = {
  label: string;
  total: number | string;
  onClick?: React.EventHandler<React.SyntheticEvent>;
};

export type StatsProps = {
  posts: Stat;
  interests: Stat;
  followers: Stat;
  following: Stat;
};

const Stats: React.FC<StatsProps> = ({ posts, interests, followers, following }) => {
  const labelProp: TextProps = {
    variant: 'footnotes2',
    weight: 'normal',
    color: {
      light: 'grey4',
      dark: 'grey7',
    },
  };

  const totalProps: TextProps = {
    variant: 'button-sm',
    weight: 'bold',
    color: {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
  };

  const stats: (Stat & { icon: IconType; className?: string })[] = [
    { ...posts, icon: 'ChatBubbleLeftRightIcon' },
    { ...interests, icon: 'HeartIcon' },
    { ...followers, icon: 'UsersIcon', className: 'scale-x-flip' },
    { ...following, icon: 'UsersIcon' },
  ];

  return (
    <Card elevation="1" radius={20} padding={16}>
      <Stack direction="column" spacing="gap-4" fullWidth>
        <Stack justify="between">
          {stats.map((stat, index) => (
            <Button onClick={stat.onClick} key={stat.label + index} plain>
              <Stack direction="column" align="center" customStyle="group">
                <AppIcon
                  placeholderIconType={stat.icon}
                  size="sm"
                  breakPointSize={{ breakPoint: 'sm', size: 'lg' }}
                  accentColor
                  customStyle={stat.className}
                  hover
                />
                <Text {...labelProp}>{stat.label}</Text>
                <Text {...totalProps}>{stat.total}</Text>
              </Stack>
            </Button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Stats;
