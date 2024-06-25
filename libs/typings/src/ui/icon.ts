import * as HeroIcons from '@heroicons/react/24/outline';

/**
 * Type defining icon types used in a design system
 **/
export type IconType =
  | keyof typeof HeroIcons
  | 'Akasha'
  | 'AlignCenter'
  | 'AlignLeft'
  | 'AlignRight'
  | 'AlignJustify'
  | 'Antenna'
  | 'BoldAlt'
  | 'DidKey'
  | 'Discord'
  | 'Eth'
  | 'Faq'
  | 'Following'
  | 'Github'
  | 'IntegrationAppCTA'
  | 'Italic'
  | 'LicenseWtfpl'
  | 'LicenseAllRights'
  | 'LicenseAttribution'
  | 'LicenseNoDerivatives'
  | 'LicenseNoRights'
  | 'LicenseNonCommercial'
  | 'LicenseShareAlike'
  | 'LicenseSomeRights'
  | 'ListNumbered'
  | 'ListBulleted'
  | 'Metamask'
  | 'NoEth'
  | 'Plugin'
  | 'Shield'
  | 'Strikethrough'
  | 'Solana'
  | 'Telegram'
  | 'TextIcon'
  | 'TextcaseLower'
  | 'TextcaseSentence'
  | 'TextcaseUpper'
  | 'Twitter'
  | 'Underline'
  | 'Vibe'
  | 'Walletconnect'
  | 'Widget';
