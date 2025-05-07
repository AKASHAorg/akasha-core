import React from 'react';

import AppIcon from '@akashaorg/design-system-core/lib/components/AppIcon';
import { Card } from '@akashaorg/ui/lib/akasha-components/card';
import { Stack } from '@akashaorg/ui/lib/akasha-components/stack';
import Text, { TextProps } from '@akashaorg/design-system-core/lib/components/Text';
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
  const labelProp: TextProps = {
    variant: 'footnotes2',
    as: 'label',
    weight: 'normal',
    color: {
      light: 'grey4',
      dark: 'grey7',
    },
  };

  const totalProp: TextProps = {
    variant: 'button-sm',
    weight: 'bold',
    color: {
      light: 'secondaryLight',
      dark: 'secondaryDark',
    },
  };

  const style = 'h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  const stats: (Stat & { icon: React.ReactElement; className?: string })[] = [
    { ...posts, icon: <MessagesSquareIcon className={style} /> },
    { ...interests, icon: <HeartIcon className={style} /> },
    { ...followers, icon: <UsersRoundIcon className={style} />, className: 'scale-x-flip' },
    { ...following, icon: <UsersRoundIcon className={style} /> },
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
                <Text id={stat.label} {...labelProp}>
                  {stat.label}
                </Text>
                <Text aria-labelledby={stat.label} {...totalProp}>
                  {stat.total}
                </Text>
              </Stack>
            </button>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
};

export default Stats;
