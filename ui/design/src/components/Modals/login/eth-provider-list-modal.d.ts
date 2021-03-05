import * as React from 'react';
export interface IProviderInfo {
  id: string;
  logo: React.ReactElement | string;
  title: string;
  description: string;
}
declare const ProvidersListModal: (props: {
  onModalClose: () => void;
  onProviderClick: (providerId: string) => void;
  providers: IProviderInfo[];
  titleLabel: string;
}) => JSX.Element;
export default ProvidersListModal;
