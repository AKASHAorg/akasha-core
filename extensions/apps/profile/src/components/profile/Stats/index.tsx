import React from 'react';

import { IconContainer } from '@akashaorg/ui/lib/akasha-components/icon-container';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import { Typography } from '@akashaorg/ui/lib/akasha-components/typography';
import { MessagesSquareIcon, HeartIcon, UsersRoundIcon } from 'lucide-react';

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

  const style = '[&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  const stats: (Stat & { icon: React.ReactElement; className?: string })[] = [
    { ...posts, icon: <MessagesSquareIcon className={style} /> },
    { ...interests, icon: <HeartIcon className={style} /> },
    { ...followers, icon: <UsersRoundIcon className={style} />, className: '[&>*]:scale-x-[-1]' },
    { ...following, icon: <UsersRoundIcon className={style} /> },
  ];

  return (
    <Card className="p-4">
      <Stack spacing={4} className="w-full">
        <Stack direction="row" justifyContent="between">
          {stats.map((stat, index) => (
            <button onClick={stat.onClick} key={stat.label + index} disabled={stat.disabled}>
              <Stack alignItems="center" className="group">
                <IconContainer
                  size="lg"
                  className={`[&_svg]:size-5 border bg-transparent group-hover:[&_*]:stroke-black group-hover:bg-accent ${stat.className ?? ''}`}
                >
                  {stat.icon}
                </IconContainer>
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
