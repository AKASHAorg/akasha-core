import React from 'react';
import { tw } from '@twind/core';

import BasicCardBox from '../BasicCardBox';
import Card from '../Card';
import Text from '../Text';

export type BasicInfoCardProps = {
  titleLabel: string;
  subtitleLabel?: string;
};

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ titleLabel, subtitleLabel }) => {
  return (
    <Card padding={8} customStyle="border-none">
      <div className={tw('flex(& col) justify-center align-center mb-32')}>
        <BasicCardBox
          customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
          round="rounded-xl"
        />
        <div className={tw('w-[50%] m-auto')}>
          <Text variant="h6" align="center">
            {titleLabel}
          </Text>
          <Text variant="footnotes2" align="center">
            {subtitleLabel}
          </Text>
        </div>
      </div>
    </Card>
  );
};
export default BasicInfoCard;
