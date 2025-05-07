import React from 'react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Grid2X2Icon } from 'lucide-react';
import { IconProps } from '../AppIcon';
import { Plugin, Widget } from '../Icon/akasha-icons';

export type ExtensionIconProps = IconProps & {
  type: AkashaAppApplicationType;
  defaultIcon?: React.ReactElement;
};

const ExtensionIcon: React.FC<ExtensionIconProps> = props => {
  const style = 'h-3 w-3 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark';

  const { type, defaultIcon = <Grid2X2Icon className={style} /> } = props;

  const getIconByType = (_type: AkashaAppApplicationType) => {
    switch (_type) {
      case AkashaAppApplicationType.App:
        return <Grid2X2Icon className={style} />;
      case AkashaAppApplicationType.Plugin:
        return <Plugin className={style} />;
      case AkashaAppApplicationType.Widget:
        return <Widget className={style} />;
      default:
        return defaultIcon;
    }
  };

  return getIconByType(type);
};

export default ExtensionIcon;
