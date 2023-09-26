import React from 'react';
import { apply, tw } from '@twind/core';
import * as HeroIconsOutline from '@heroicons/react/24/outline';
import * as HeroIconsSolid from '@heroicons/react/24/solid';

import { IconType } from '@akashaorg/typings/lib/ui';

import * as CustomIcons from './akasha-icons';

type PassedIconProps = {
  type: IconType;
  testId: string;
  customStyle: string;
  solid: boolean;
};

export const PassedIcon: React.FC<PassedIconProps> = ({
  solid,
  type,
  customStyle = '',
  testId,
}) => {
  let PassedIcon = null;

  const HeroIcons = solid ? HeroIconsSolid : HeroIconsOutline;

  if (HeroIcons[type]) PassedIcon = HeroIcons[type];

  if (CustomIcons[type]) PassedIcon = CustomIcons[type];

  if (!PassedIcon) {
    // tslint:disable-next-line no-console
    console.error('There is no such icon', type);
  }

  return <PassedIcon className={tw(apply`${customStyle}`)} data-testid={testId} />;
};
