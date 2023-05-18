import React from 'react';

import * as HeroIconsOutline from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';

import * as CustomIcons from './akasha-icons';
import { APP_ICON_TO_HERO_ICON_MAP, IconType } from '@akashaorg/typings/ui';
import { isAppIcon } from './isAppIcon';
import { apply, tw } from '@twind/core';

type PassedIconProps = {
  type: IconType;
  testId: string;
  customStyle: string;
  solid: boolean;
};

export const PassedIcon: React.FC<PassedIconProps> = ({ solid, type, customStyle, testId }) => {
  let iconStyle = customStyle;
  let PassedIcon = null;

  const HeroIcons = solid ? HeroIconsSolid : HeroIconsOutline;

  /* @TODO: change the following logic once the old design system is fully replaced */
  if (isAppIcon(type)) {
    PassedIcon = HeroIcons[APP_ICON_TO_HERO_ICON_MAP[type]];
    if (type === 'appModeration') {
      iconStyle = `scale-x-flip ${customStyle}`;
    }

    if (type === 'appCenter') {
      iconStyle = `-rotate-90 ${customStyle}`;
    }
  }

  if (HeroIcons[type]) PassedIcon = HeroIcons[type];

  if (CustomIcons[type]) PassedIcon = CustomIcons[type];

  if (!PassedIcon) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', type);
  }

  return <PassedIcon className={tw(apply`${iconStyle}`)} data-testid={testId} />;
};
