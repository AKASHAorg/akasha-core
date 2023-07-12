import { IconType } from '@akashaorg/typings/ui';

import akasha from './akasha';
import didKey from './didKey';
import discord from './discord';
import eth from './eth';
import faq from './faq';
import github from './github';
import shield from './shield';
import solana from './solana';
import telegram from './telegram';
import twitter from './twitter';
import widget from './widget';
import metamask from './metamask';
import walletconnect from './walletconnect';

/**
 * maintain alphabetical order for custom icon names
 */
export type CustomIconTypes = Extract<
  IconType,
  | 'akasha'
  | 'didKey'
  | 'discord'
  | 'eth'
  | 'faq'
  | 'github'
  | 'metamask'
  | 'shield'
  | 'solana'
  | 'telegram'
  | 'twitter'
  | 'walletconnect'
  | 'widget'
>;

export {
  akasha,
  didKey,
  discord,
  eth,
  faq,
  github,
  metamask,
  shield,
  solana,
  telegram,
  twitter,
  walletconnect,
  widget,
};
