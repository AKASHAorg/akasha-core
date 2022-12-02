import React from 'react';
import { useTranslation } from 'react-i18next';

import DS from '@akashaorg/design-system';
import { RootComponentProps } from '@akashaorg/typings/ui';

import ConnectWallet from './connect-wallet';
import { getStatusLabel } from '../../utils/connect';

const { MainAreaCardBox } = DS;

export enum ConnectStep {
  CHOOSE_PROVIDER = 'Choose_Provider',
  CONNECT_WALLET = 'Connect_Wallet',
}

export enum ConnectWalletStatus {
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
  ERROR = 'Error',
}

const Connect: React.FC<RootComponentProps> = () => {
  const [step] = React.useState<ConnectStep>(ConnectStep.CONNECT_WALLET);

  const [status] = React.useState<ConnectWalletStatus>(ConnectWalletStatus.CONNECTED);

  const [errorText] = React.useState<string>('Failed to Authorize');

  const { t } = useTranslation('app-auth-ewa');

  return (
    <MainAreaCardBox pad="large">
      {step === ConnectStep.CONNECT_WALLET && (
        <ConnectWallet
          titleLine1Label={t('{{connect}} to AKASHA World', {
            connect: status === ConnectWalletStatus.CONNECTED ? 'Connected' : 'Connecting',
          })}
          titleLine2Label={t('using your wallet')}
          status={status}
          statusLabel={t(getStatusLabel(status, errorText))}
          statusDescription={t('You will be prompted with 2 signatures')}
          yourAddressLabel={t('Your Address')}
          connectedAddress=""
          connectedAddressPlaceholder={t(
            'the address you select to connect with will be shown here',
          )}
          footerLabel="Disconnect or change way to connect"
        />
      )}
    </MainAreaCardBox>
  );
};

export default Connect;
