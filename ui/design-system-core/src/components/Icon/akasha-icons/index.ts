import { IconType } from '@akashaorg/typings/lib/ui';

import akasha from './akasha';
import alignCenter from './align-center';
import alignJustify from './align-justify';
import alignLeft from './align-left';
import alignRight from './align-right';
import antenna from './antenna';
import boldAlt from './bold-alt';
import didKey from './didKey';
import discord from './discord';
import eth from './eth';
import faq from './faq';
import github from './github';
import integrationAppCTA from './integration-app-cta';
import italic from './italic';
import licensewtfpl from './license-wtfpl';
import licenseAllRights from './license-all-rights';
import licenseAttribution from './license-attribution';
import licenseNoDerivatives from './license-no-derivatives';
import licenseNoRights from './license-no-rights';
import licenseNonCommercial from './license-non-commercial';
import licenseShareAlike from './license-share-alike';
import licenseSomeRights from './license-some-rights';
import listBulleted from './list-bulleted';
import listNumbered from './list-numbered';
import noEth from './no-eth';
import shield from './shield';
import strikethrough from './strikethrough';
import solana from './solana';
import telegram from './telegram';
import text from './text';
import textcaseLower from './textcase-lower';
import textcaseSentence from './textcase-sentence';
import textcaseUpper from './textcase-upper';
import twitter from './twitter';
import underline from './underline';
import vibe from './vibe';
import widget from './widget';
import metamask from './metamask';
import walletconnect from './walletconnect';
import following from './following';

/**
 * maintain alphabetical order for custom icon names
 */
export type CustomIconTypes = Extract<
  IconType,
  | 'akasha'
  | 'alignCenter'
  | 'alignLeft'
  | 'alignRight'
  | 'alignJustify'
  | 'antenna'
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
  | 'strikethrough'
  | 'solana'
  | 'telegram'
  | 'text'
  | 'textcaseLower'
  | 'textcaseSentence'
  | 'textcaseUpper'
  | 'twitter'
  | 'underline'
  | 'vibe'
  | 'walletconnect'
  | 'widget'
  | 'following'
>;

export {
  akasha,
  alignCenter,
  alignJustify,
  alignLeft,
  alignRight,
  antenna,
  boldAlt,
  discord,
  didKey,
  faq,
  github,
  integrationAppCTA,
  italic,
  licensewtfpl,
  licenseAllRights,
  licenseAttribution,
  licenseNoDerivatives,
  licenseNoRights,
  licenseNonCommercial,
  licenseShareAlike,
  licenseSomeRights,
  listBulleted,
  listNumbered,
  strikethrough,
  text,
  textcaseLower,
  textcaseSentence,
  textcaseUpper,
  eth,
  metamask,
  noEth,
  shield,
  solana,
  telegram,
  twitter,
  underline,
  vibe,
  walletconnect,
  widget,
  following,
};
