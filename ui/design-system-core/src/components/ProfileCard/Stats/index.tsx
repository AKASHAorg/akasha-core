import React from 'react';
import Card from '../../Card';
import Stack from '../../Stack';
import Icon, { IconType } from '../../Icon';
import Text, { TextProps } from '../../Text';
import { apply, tw } from '@twind/core';

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
  const iconContainerStyle = tw(
    apply`rounded-full p-2 h-8 w-8 sm:p-2 sm:h-12 sm:w-12 bg-grey9 dark:grey3`,
  );
  const iconStyle = tw(apply`h-4 sm:h-6 stroke-secondary-light dark:stroke-secondary-dark`);

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
              <Stack direction="column" align="center">
                <Stack
                  className={tw(apply`${iconContainerStyle} ${stat.className}`)}
                  align="center"
                  justify="center"
                >
                  <Icon type={stat.icon} styling={iconStyle} />
                </Stack>
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
