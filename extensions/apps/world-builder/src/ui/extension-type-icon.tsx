import * as React from 'react';
import { LayoutGrid, LayoutPanelLeft, Puzzle } from 'lucide-react';

import { cn } from '@/ui/library/utils';
import { ExtensionType } from '@/ui/types/extension-type';

const Icon = ({ extensionType }: { extensionType: ExtensionType }) => {
  switch (extensionType) {
    case ExtensionType.App:
      return <LayoutGrid />;
    case ExtensionType.Plugin:
      return <Puzzle />;
    case ExtensionType.Widget:
      return <LayoutPanelLeft />;
    default:
      return <LayoutGrid />;
  }
};

const ExtensionTypeIcon = ({
  extensionType = ExtensionType.App,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  extensionType?: ExtensionType;
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
