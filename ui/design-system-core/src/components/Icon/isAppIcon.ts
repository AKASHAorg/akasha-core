import { AppIcons, IconType } from '@akashaorg/typings/ui';

/* @TODO: remove the following function once the old design system is fully replaced */
export function isAppIcon(icon: IconType): icon is AppIcons {
  return [
    'appCenter',
    'appModeration',
    'bookmark',
    'chatBubble',
    'explore',
    'message',
    'notifications',
    'search',
    'settingsAlt',
  ].includes(icon);
}
