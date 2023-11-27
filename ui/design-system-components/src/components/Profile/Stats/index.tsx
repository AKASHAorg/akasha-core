import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
import { ChatBubbleLeftRightIcon, HeartIcon, UsersIcon } from '@heroicons/react/24/outline';

type Stat = {
  label: string;
  total: number | string;
  disabled?: boolean;
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

  const stats: (Stat & { icon: React.ReactElement; className?: string })[] = [
    { ...posts, icon: <ChatBubbleLeftRightIcon /> },
    { ...interests, icon: <HeartIcon /> },
    { ...followers, icon: <UsersIcon />, className: 'scale-x-flip' },
    { ...following, icon: <UsersIcon /> },
  ];

  return (
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack spacing="gap-4" fullWidth>
        <Stack direction="row" justify="between">
          {stats.map((stat, index) => (
            <Button onClick={stat.onClick} key={stat.label + index} disabled={stat.disabled} plain>
              <Stack align="center" customStyle="group">
                <AppIcon
                  placeholderIcon={stat.icon}
                  size="sm"
                  breakPointSize={{ breakPoint: 'sm', size: 'lg' }}
                  customStyle={stat.className}
                  accentColor
                  hover={!stat.disabled}
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
