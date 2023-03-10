import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Text, { TextProps } from '../../Text';
import AppIcon from '../../AppIcon';
import { IconType } from '@akashaorg/typings/ui';

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
      light: 'text-grey4',
      dark: 'text-grey7',
    },
  };

  const totalProps: TextProps = {
    variant: 'button-sm',
    weight: 'bold',
    color: {
      light: 'text-secondary-light',
      dark: 'text-secondary-dark',
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
      <Stack direction="column" spacing="gap-4">
        <Stack justify="between">
          {stats.map((stat, index) => (
            <button onClick={stat.onClick} key={stat.label + index}>
              <Stack direction="column" align="center" style="group">
                <AppIcon
                  placeholderIconType={stat.icon}
                  size="md"
                  breakPointSize={{ breakPoint: 'md', size: 'xl' }}
                  accentColor
                  style={stat.className}
                  hover
                />
                <Text {...labelProp}>{stat.label}</Text>
                <Text {...totalProps}>{stat.total}</Text>
              </Stack>
            </button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Stats;
