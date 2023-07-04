import { IconType } from '@akashaorg/typings/ui';

import akasha from './akasha';
import discord from './discord';
import faq from './faq';
import github from './github';
import integrationAppCTA from './integration-app-cta';
import licensewtfpl from './license-wtfpl';
import licenseAllRights from './license-all-rights';
import licenseAttribution from './license-attribution';
import licenseNoDerivatives from './license-no-derivatives';
import licenseNoRights from './license-no-rights';
import licenseNonCommercial from './license-non-commercial';
import licenseShareAlike from './license-share-alike';
import licenseSomeRights from './license-some-rights';
import shield from './shield';
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
  | 'discord'
  | 'faq'
  | 'github'
  | 'integrationAppCTA'
  | 'licensewtfpl'
  | 'licenseAllRights'
  | 'licenseAttribution'
  | 'licenseNoDerivatives'
  | 'licenseNoRights'
  | 'licenseNonCommercial'
  | 'licenseShareAlike'
  | 'licenseSomeRights'
  | 'metamask'
  | 'shield'
  | 'telegram'
  | 'twitter'
  | 'walletconnect'
  | 'widget'
>;

export {
  akasha,
  discord,
  faq,
  github,
  integrationAppCTA,
  licensewtfpl,
  licenseAllRights,
  licenseAttribution,
  licenseNoDerivatives,
  licenseNoRights,
  licenseNonCommercial,
  licenseShareAlike,
  licenseSomeRights,
  metamask,
  shield,
  telegram,
  twitter,
  walletconnect,
  widget,
};
