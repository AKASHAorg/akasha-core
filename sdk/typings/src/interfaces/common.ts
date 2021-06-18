export interface DataProviderInput {
  provider: string;
  property: string;
  value: string;
}

export interface CurrentUser {
  pubKey: string;
  ethAddress: string;
  isNewUser?: boolean;
}

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}
