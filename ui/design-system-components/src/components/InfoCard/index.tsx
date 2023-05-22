import React from 'react';
import { tw } from '@twind/core';
import BasicCardBox from '@akashaorg/design-system-core/lib/components/BasicCardBox';
import Text from '@akashaorg/design-system-core/lib/components/Text';
import Card from '@akashaorg/design-system-core/lib/components/Card';

export interface InfoProps {
  explanation: string;
  suggestion: string;
  keyword: string;
  preposition_in: string;
  section?: string;
  noBorder?: boolean;
  noPadding?: boolean;
}

const InfoCard: React.FC<InfoProps> = ({
  explanation,
  suggestion,
  keyword,
  preposition_in,
  section,
  noBorder,
  noPadding,
}: InfoProps) => {
  return (
    <Card padding={8} customStyle="border-none">
      <div className={tw('flex(& col) justify-center align-center mb-32')}>
        <BasicCardBox
          customStyle="bg(grey8 dark:grey5) w-[180px] h-[180px] m-auto my-4"
          round="rounded-xl"
        />
        <div className={tw('w-[50%] m-auto')}>
          <Text variant="body1" align="center">
            {explanation} <span className={tw('font-bold')}>{keyword}</span> {preposition_in}
            <span className={tw('font-bold')}>{section}</span>. {suggestion}
          </Text>
        </div>
      </div>
    </Card>
  );
};

export default InfoCard;
