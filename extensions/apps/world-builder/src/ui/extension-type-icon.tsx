import * as React from 'react';
import { cn } from '@/ui/library/utils';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { IconByExtension } from '@akashaorg/ui/lib/akasha-components/extension-type-icon';

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
      <IconByExtension extensionType={extensionType} />
    </div>
  );
};

export { ExtensionTypeIcon };
