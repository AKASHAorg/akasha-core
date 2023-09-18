import * as React from 'react';
import { tw } from '@twind/core';
import Card from '@akashaorg/design-system-core/lib/components/Card';
import TextLine from '@akashaorg/design-system-core/lib/components/TextLine';

export interface IPlaceholderProps {
  height?: number;
  animated?: boolean;
  children?: React.ReactNode;
}

const EntryLoadingPlaceholder: React.FC<IPlaceholderProps> = props => {
  const { height = 200, animated = false, children } = props;
  return (
    <Card padding={'p-4'} customStyle={`min-h-[${height}]`}>
      <div className={tw(`flex flex-row`)}>
        <div className={tw(`flex flex-row items-center`)}>
          <TextLine title="avatar" width="40" height="40" round={'rounded-full'} />

          <div className={tw(`flex flex-col ml-2 gap-x-1`)}>
            <TextLine title="author name" width="220" animated={animated} />
            <TextLine title="entry-publish-date" width="160" animated={animated} />
          </div>
        </div>
      </div>
      <div className={tw(`flex flex-col mt-4 gap-x-1`)}>
        <TextLine title="entry-publish-date" width="w-full" animated={animated} round={'none'} />
        <TextLine title="entry-publish-date" width="w-11/12" animated={animated} round={'none'} />
        <TextLine title="entry-publish-date" width="w-6/12" animated={animated} round={'none'} />
        <TextLine title="entry-publish-date" width="w-10/12" animated={animated} round={'none'} />
        <TextLine title="entry-publish-date" width="w-8/12" animated={animated} round={'none'} />
        {children}
      </div>
    </Card>
  );
};

export default EntryLoadingPlaceholder;
