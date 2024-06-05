import {
  AkashaBeamStreamFiltersInput,
  AkashaBeamStreamModerationStatus,
  AkashaIndexedStreamFiltersInput,
  AkashaIndexedStreamModerationStatus,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { QueryKeys } from '@akashaorg/typings/lib/ui';

export const findLastItem = <T>(items: T[], predicate: (item: T) => boolean): T | undefined => {
  let found: T | undefined = undefined;
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (predicate(items[i])) {
      found = items[i];
      break;
    }
  }
  return found;
};
export const isWindow = () => typeof window !== 'undefined';
export const dpr = isWindow() ? window.devicePixelRatio ?? 1 : 1;
export const pxToDPR = (px: number, dpr: number) => Math.ceil(px * dpr) / dpr;

export const getNsfwFiltersForBeamFeed = ({
  did,
  showNsfw,
  isLoggedIn,
}: {
  did?: string;
  showNsfw: boolean;
  isLoggedIn: boolean;
}): AkashaBeamStreamFiltersInput[] => {
  /**
   * Set the filter for logged-out users and users who toggled off nsfw content.
   **/
  if (!did && (!showNsfw || !isLoggedIn)) {
    return [
      { where: { status: { equalTo: AkashaBeamStreamModerationStatus.Ok } } },
      { where: { status: { isNull: true } } },
    ];
  }

  /**
   * Set the filter for users who are logged in and want to see nsfw content.
   **/
  if (!did && showNsfw && isLoggedIn) {
    return [
      {
        where: {
          status: {
            in: [AkashaBeamStreamModerationStatus.Ok, AkashaBeamStreamModerationStatus.Nsfw],
          },
        },
      },
      { where: { status: { isNull: true } } },
    ];
  }
  return [];
};

export const getNsfwFiltersForTagFeed = ({
  queryKey,
  showNsfw,
  isLoggedIn,
}: {
  queryKey: string;
  showNsfw: boolean;
  isLoggedIn: boolean;
}): AkashaIndexedStreamFiltersInput[] => {
  /**
   *  Check if the feed will be used inside the My Antenna page and
   *  set the filter for logged-out users and users who toggled off nsfw content.
   **/
  if (queryKey === QueryKeys.MY_ANTENNA && (!showNsfw || !isLoggedIn)) {
    return [
      { where: { status: { equalTo: AkashaIndexedStreamModerationStatus.Ok } } },
      { where: { status: { isNull: true } } },
    ];
  }

  /**
   * Check if the feed will be used inside the My Antenna page and
   * set the filter for users who are logged in and want to see nsfw content.
   **/
  if (queryKey === QueryKeys.MY_ANTENNA && showNsfw && isLoggedIn) {
    return [
      {
        where: {
          status: {
            in: [AkashaIndexedStreamModerationStatus.Ok, AkashaIndexedStreamModerationStatus.Nsfw],
          },
        },
      },
      { where: { status: { isNull: true } } },
    ];
  }
  return [];
};
