import * as React from 'react';
import { LayoutGridIcon, LayoutPanelLeftIcon, PuzzleIcon } from 'lucide-react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { cn } from '../library/utils';

const IconByExtension = ({ extensionType }: { extensionType: AkashaAppApplicationType }) => {
  const style = 'h-3 w-3 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  switch (extensionType) {
    case AkashaAppApplicationType.App:
      return <LayoutGridIcon className={style} />;
    case AkashaAppApplicationType.Plugin:
      return <PuzzleIcon className={style} />;
    case AkashaAppApplicationType.Widget:
      return <LayoutPanelLeftIcon className={style} />;
    default:
      return <LayoutGridIcon />;
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
        'flex items-center justify-center size-5 [&_svg]:size-3 text-secondary-foreground rounded-full bg-trsnaparent',
        className,
      )}
      {...props}
    >
      <IconByExtension extensionType={extensionType} />
    </div>
  );
};

export { ExtensionTypeIcon, IconByExtension };
