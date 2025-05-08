import React from 'react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { LayoutGridIcon, LayoutPanelLeftIcon, PuzzleIcon } from 'lucide-react';
import { IconProps } from '../AppIcon';

export type ExtensionIconProps = IconProps & {
  type: AkashaAppApplicationType;
  defaultIcon?: React.ReactElement;
};

const ExtensionIcon: React.FC<ExtensionIconProps> = props => {
  const style = 'h-3 w-3 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  const { type, defaultIcon = <LayoutGridIcon className={style} /> } = props;

  const getIconByType = (_type: AkashaAppApplicationType) => {
    switch (_type) {
      case AkashaAppApplicationType.App:
        return <LayoutGridIcon className={style} />;
      case AkashaAppApplicationType.Plugin:
        return <PuzzleIcon className={style} />;
      case AkashaAppApplicationType.Widget:
        return <LayoutPanelLeftIcon className={style} />;
      default:
        return defaultIcon;
    }
  };

  return getIconByType(type);
};

export default ExtensionIcon;
