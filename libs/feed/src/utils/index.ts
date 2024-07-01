import {
  AkashaBeamStreamFiltersInput,
  AkashaBeamStreamModerationStatus,
  AkashaIndexedStreamFiltersInput,
  AkashaIndexedStreamModerationStatus,
} from '@akashaorg/typings/lib/sdk/graphql-types-new';

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
  showNsfw,
  isLoggedIn,
}: {
  showNsfw: boolean;
  isLoggedIn: boolean;
}): AkashaBeamStreamFiltersInput[] => {
  /**
   * Set the filter for logged-out users and users who toggled off nsfw content.
   **/
  if (!showNsfw || !isLoggedIn) {
    return [
      { where: { status: { equalTo: AkashaBeamStreamModerationStatus.Ok } } },
      { where: { status: { isNull: true } } },
    ];
  }

  /**
   * Set the filter for users who are logged in and want to see nsfw content.
   **/
  if (showNsfw && isLoggedIn) {
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
  showNsfw,
  isLoggedIn,
}: {
  showNsfw: boolean;
  isLoggedIn: boolean;
}): AkashaIndexedStreamFiltersInput[] => {
  /**
   *  Set the filter for logged-out users and users who toggled off nsfw content.
   **/
  if (!showNsfw || !isLoggedIn) {
    return [
      { where: { status: { equalTo: AkashaIndexedStreamModerationStatus.Ok } } },
      { where: { status: { isNull: true } } },
    ];
  }

  /**
   * Set the filter for users who are logged in and want to see nsfw content.
   **/
  if (showNsfw && isLoggedIn) {
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
