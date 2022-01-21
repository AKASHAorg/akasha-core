export interface DataProviderInput {
  provider: string;
  property: string;
  value: string;
}

export interface CurrentUser {
  pubKey: string;
  ethAddress: string;
  isNewUser?: boolean;
  filAddress?: string;
}

export enum LEGAL_DOCS {
  TERMS_OF_USE = 'TermsOfUse',
  TERMS_OF_SERVICE = 'TermsOfService',
  PRIVACY_POLICY = 'PrivacyPolicy',
  CODE_OF_CONDUCT = 'CodeOfConduct',
  APP_GUIDE = 'AppGuide',
}

export enum INJECTED_PROVIDERS {
  METAMASK = 'MetaMask',
  SAFE = 'Safe',
  NIFTY = 'Nifty',
  DAPPER = 'Dapper',
  OPERA = 'Opera',
  TRUST = 'Trust',
  COINBASE = 'Coinbase',
  CIPHER = 'Cipher',
  IM_TOKEN = 'imToken',
  STATUS = 'Status',
  FALLBACK = 'Web3',
  NOT_DETECTED = 'NotDetected',
}

export enum PROVIDER_ERROR_CODES {
  UserRejected = 4001,
  WrongNetwork = 4002,
  RequestTimeout = 4003,
}
