import React from 'react';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import Stack from '@akashaorg/design-system-core/lib/components/Stack';
import Button from '@akashaorg/design-system-core/lib/components/Button';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
import { IconType } from '@akashaorg/typings/ui';
import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';

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
      <Stack direction="column" spacing="gap-4" fullWidth>
        <Stack justify="between">
          {stats.map((stat, index) => (
            <Button
              onClick={+stat.total > 0 ? stat.onClick : undefined}
              key={stat.label + index}
              disabled={+stat.total === 0}
              plain
            >
              <Stack direction="column" align="center" customStyle="group">
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
