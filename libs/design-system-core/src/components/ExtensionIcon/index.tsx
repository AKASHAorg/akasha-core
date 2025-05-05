import React from 'react';
import { AkashaAppApplicationType } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { Layers2Icon } from 'lucide-react';
import Icon, { IconProps } from '../Icon';
import { Plugin, Widget } from '../Icon/akasha-icons';

export type ExtensionIconProps = IconProps & {
  type: AkashaAppApplicationType;
  defaultIcon?: React.ReactElement;
};

const ExtensionIcon: React.FC<ExtensionIconProps> = props => {
  const {
    size = 'sm',
    solid = false,
    accentColor = true,
    type,
    defaultIcon = <Layers2Icon className="h-5 w-5 [&>*]:stroke-secondaryLight dark:[&>*]:stroke-secondaryDark" />,
  } = props;

  const getIconByType = (_type: AkashaAppApplicationType) => {
    switch (_type) {
      case AkashaAppApplicationType.App:
        return <Layers2Icon />;
      case AkashaAppApplicationType.Plugin:
        return <Plugin />;
      case AkashaAppApplicationType.Widget:
        return <Widget />;
      default:
        return defaultIcon;
    }
  };

  return (
    <Icon
      size={size}
      solid={
        [AkashaAppApplicationType.Plugin, AkashaAppApplicationType.Widget].includes(type) || solid
      }
      accentColor={accentColor}
      icon={getIconByType(type)}
    />
  );
};

export default ExtensionIcon;
