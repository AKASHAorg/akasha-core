import React from 'react';

import { IconType } from '@akashaorg/typings/lib/ui';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';

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
    <Card elevation="1" radius={20} padding={'p-4'}>
      <Stack spacing="gap-4" fullWidth>
        <Stack direction="row" justify="between">
          {stats.map((stat, index) => (
            <Button
              onClick={
                +stat.total > 0 || stat.label.includes('Interests') ? stat.onClick : undefined
              }
              key={stat.label + index}
              disabled={+stat.total === 0 && !stat.label.includes('Interests')}
              plain
            >
              <Stack align="center" customStyle="group">
                <AppIcon
                  placeholderIconType={stat.icon}
                  size="sm"
                  breakPointSize={{ breakPoint: 'sm', size: 'lg' }}
                  customStyle={stat.className}
                  accentColor
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
