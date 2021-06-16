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
