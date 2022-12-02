import React from 'react';
import DS from '@akashaorg/design-system';
import BoxedIcon from './boxed-icon';
import IndicatorDots from './indicator-dots';
import { ConnectWalletStatus } from '.';

export interface IConnectWalletProps {
  titleLine1Label: string;
  titleLine2Label: string;
  status: ConnectWalletStatus;
  statusLabel: string;
  statusDescription: string;
  yourAddressLabel: string;
  connectedAddress: string;
  connectedAddressPlaceholder: string;
  footerLabel: string;
}

const { Box, Icon, Text } = DS;

const ConnectWallet: React.FC<IConnectWalletProps> = props => {
  const {
    titleLine1Label,
    titleLine2Label,
    status,
    statusLabel,
    statusDescription,
    yourAddressLabel,
    connectedAddress,
    connectedAddressPlaceholder,
    footerLabel,
  } = props;

  return (
    <Box
      // border={{ color: 'red' }}
      gap="medium"
    >
      <Box align="center">
        <Text size="xlarge" weight="bold">
          {titleLine1Label}
        </Text>
        <Text size="xlarge" weight="bold">
          {titleLine2Label}
        </Text>
      </Box>

      <Box direction="row" justify="center" align="center" gap="small">
        <BoxedIcon iconType="metamask" backgroundColor="#fef5e6" iconSize="xxl" />

        <IndicatorDots status={status} />

        <BoxedIcon
          iconType="akasha"
          backgroundColor="linear-gradient(180deg, #D2DBFF 0%, #FBD5D4 100%)"
          iconSize="xxl"
        />
      </Box>

      <Box gap="small">
        <Box align="center">
          <Text size="xlarge" weight="bold">
            {statusLabel}
          </Text>
          <Text color="secondaryText">{statusDescription}</Text>
        </Box>

        <Box align="center">
          <Text size="small" color="secondaryText">
            {yourAddressLabel}
          </Text>
          {!!connectedAddress.length && <Text color="secondaryText">{connectedAddress}</Text>}

          {!connectedAddress.length && (
            <Text color="secondaryText">{connectedAddressPlaceholder}</Text>
          )}
        </Box>

        <Box direction="row" justify="center" gap="small">
          <Icon type="disconnect" plain={true} />
          <Text size="large" color="accentText" onClick={() => null}>
            {footerLabel}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default ConnectWallet;
