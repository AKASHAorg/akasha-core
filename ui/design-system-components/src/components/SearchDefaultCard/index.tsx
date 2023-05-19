import React from 'react';
import { tw } from '@twind/core';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Text from '@akashaorg/design-system-core/lib/components/Text';

const SearchDefaultCard: React.FC = () => {
  return (
    <div className={tw('flex(& col) justify-center align-center mb-32')}>
      <BasicCardBox
        customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
        round="rounded-xl"
      />
      <Text variant="h6" align="center">
        ✨ Start searching for something ✨
      </Text>
    </div>
  );
};

export default SearchDefaultCard;
