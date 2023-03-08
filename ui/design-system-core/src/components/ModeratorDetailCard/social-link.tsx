import React from 'react';
import { tw } from '@twind/core';

import AppIcon, { IAppIcon } from '../AppIcon';

export interface ISocialLinksProps {
  iconType: IAppIcon['placeholderIconType'];
  iconSize?: IAppIcon['size'];
  onClick: () => void;
}

const SocialLink: React.FC<ISocialLinksProps> = props => {
  const { iconType, iconSize = 'md', onClick } = props;

  return (
    <div
      className={tw(`flex items-center justify-center w-8 h-8 rounded-full bg-grey9 dark:bg-grey3`)}
      onClick={onClick}
    >
      <AppIcon size={iconSize} placeholderIconType={iconType} />
    </div>
  );
};

export default SocialLink;
