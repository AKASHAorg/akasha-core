import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
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
  const labelProp: React.ComponentProps<typeof Typography> = {
    variant: 'xs',
    className: 'text-grey4 dark:text-grey7',
  };

  const totalProp: React.ComponentProps<typeof Typography> = {
    variant: 'xs',
    bold: true,
    className: 'text-secondaryLight dark:text-secondaryDark',
  };

  const stats: (Stat & { icon: React.ReactElement; className?: string })[] = [
    { ...posts, icon: <ChatBubbleLeftRightIcon /> },
    { ...interests, icon: <HeartIcon /> },
    { ...followers, icon: <UsersIcon />, className: 'scale-x-flip' },
    { ...following, icon: <UsersIcon /> },
  ];

  return (
    <Card className="p-4">
      <Stack spacing={4} className="w-full">
        <Stack direction="row" justifyContent="between">
          {stats.map((stat, index) => (
            <button onClick={stat.onClick} key={stat.label + index} disabled={stat.disabled}>
              <Stack alignItems="center" className="group">
                <AppIcon
                  placeholderIcon={stat.icon}
                  size="lg"
                  customStyle={stat.className}
                  accentColor
                  hover={!stat.disabled}
                />
                <Typography id={stat.label} {...labelProp}>
                  {stat.label}
                </Typography>
                <Typography aria-labelledby={stat.label} {...totalProp}>
                  {stat.total}
                </Typography>
              </Stack>
            </button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Stats;
