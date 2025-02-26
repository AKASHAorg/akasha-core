import * as React from 'react';
import { LayoutGrid, LayoutPanelLeft, Puzzle } from 'lucide-react';

import { cn } from '@/ui/library/utils';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';

const Icon = ({ extensionType }: { extensionType: AkashaAppApplicationType }) => {
  switch (extensionType) {
    case AkashaAppApplicationType.App:
      return <LayoutGrid />;
    case AkashaAppApplicationType.Plugin:
      return <Puzzle />;
    case AkashaAppApplicationType.Widget:
      return <LayoutPanelLeft />;
    default:
      return <LayoutGrid />;
  }
};

const ExtensionTypeIcon = ({
  extensionType = AkashaAppApplicationType.App,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  extensionType?: AkashaAppApplicationType;
}) => {
  return (
    <div
      data-slot="extension-type-icon"
      className={cn(
        'flex items-center justify-center size-5 [&_svg]:size-3 text-secondary-foreground rounded-full bg-secondary',
        className,
      )}
      {...props}
    >
      <Icon extensionType={extensionType} />
    </div>
  );
};

export { ExtensionTypeIcon };
