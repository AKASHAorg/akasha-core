import * as HeroIcons from '@heroicons/react/24/outline';

/* @TODO: remove the following once the old design system is fully replaced */
export type AppIcons =
  | 'appSocial'
  | 'appCenter'
  | 'appModeration'
  | 'bookmark'
  | 'chatBubble'
  | 'explore'
  | 'message'
  | 'notifications'
  | 'search'
  | 'settingsAlt';

export type IconType =
  | keyof typeof HeroIcons
  | 'akasha'
  | 'alignCenter'
  | 'alignLeft'
  | 'alignRight'
  | 'alignJustify'
  | 'boldAlt'
  | 'didKey'
  | 'discord'
  | 'eth'
  | 'faq'
  | 'github'
  | 'integrationAppCTA'
  | 'italic'
  | 'licensewtfpl'
  | 'licenseAllRights'
  | 'licenseAttribution'
  | 'licenseNoDerivatives'
  | 'licenseNoRights'
  | 'licenseNonCommercial'
  | 'licenseShareAlike'
  | 'licenseSomeRights'
  | 'listNumbered'
  | 'listBulleted'
  | 'metamask'
  | 'noEth'
  | 'shield'
  | 'underline'
  | 'strikethrough'
  | 'solana'
  | 'telegram'
  | 'textcaseLower'
  | 'textcaseSentence'
  | 'textcaseUpper'
  | 'twitter'
  | 'walletconnect'
  | 'widget'
  | AppIcons;

/* @TODO: remove the following once the old design system is fully replaced */
export const APP_ICON_TO_HERO_ICON_MAP: Record<AppIcons, IconType> = {
  appSocial: 'akasha',
  appCenter: 'SquaresPlusIcon',
  appModeration: 'UsersIcon',
  bookmark: 'BookmarkIcon',
  chatBubble: 'ChatBubbleOvalLeftEllipsisIcon',
  explore: 'SparklesIcon',
  message: 'EnvelopeIcon',
  notifications: 'BellIcon',
  search: 'MagnifyingGlassIcon',
  settingsAlt: 'Cog8ToothIcon',
};
