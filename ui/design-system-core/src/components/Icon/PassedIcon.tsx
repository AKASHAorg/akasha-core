import React from 'react';
import * as HeroIcons from '@heroicons/react/24/outline';
import * as CustomIcons from './akasha-icons';
import { APP_ICON_TO_HERO_ICON_MAP, IconType } from '@akashaorg/typings/ui';
import { apply, tw } from '@twind/core';
import { isAppIcon } from './isAppIcon';

type PassedIconProps = {
  type: IconType;
  testId: string;
  style: string;
};

export const PassedIcon: React.FC<PassedIconProps> = ({ type, style, testId }) => {
  let iconStyle = style;
  let PassedIcon = null;

  /* @TODO: change the following logic once the old design system is fully replaced */
  if (isAppIcon(type)) {
    PassedIcon = HeroIcons[APP_ICON_TO_HERO_ICON_MAP[type]];
    if (type === 'appModeration') {
      iconStyle = `${style} scale-x-flip`;
    }

    if (type === 'appCenter') {
      iconStyle = `${style} -rotate-90`;
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
