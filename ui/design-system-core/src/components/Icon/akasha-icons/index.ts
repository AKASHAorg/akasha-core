import { IconType } from '@akashaorg/typings/ui';

import akasha from './akasha';
import alignCenter from './align-center';
import alignJustify from './align-justify';
import alignLeft from './align-left';
import alignRight from './align-right';
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
import underline from './underline';
import shield from './shield';
import strikethrough from './strikethrough';
import solana from './solana';
import telegram from './telegram';
import textcaseLower from './textcase-lower';
import textcaseSentence from './textcase-sentence';
import textcaseUpper from './textcase-upper';
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
  | 'underline'
  | 'shield'
  | 'strikethrough'
  | 'solana'
  | 'telegram'
  | 'textcaseLower'
  | 'textcaseSentence'
  | 'textcaseUpper'
  | 'twitter'
  | 'walletconnect'
  | 'widget'
>;

export {
  akasha,
  alignCenter,
  alignJustify,
  alignLeft,
  alignRight,
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
  textcaseLower,
  textcaseSentence,
  textcaseUpper,
  eth,
  metamask,
  noEth,
  underline,
  shield,
  solana,
  telegram,
  twitter,
  walletconnect,
  widget,
};
