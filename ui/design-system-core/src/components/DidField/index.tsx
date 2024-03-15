import React from 'react';
import Icon from '../Icon';
import Stack from '../Stack';
import Text from '../Text';
import CopyToClipboard from '../CopyToClipboard';
import { Eth, Solana, DidKey, NoEth } from '../Icon/akasha-icons';
import { Color } from '../types/common.types';
import { getDidNetworkType, truncateDid } from '../../utils/did-utils';

const didNetworkIconMapping = {
  eth: <Eth />,
  solana: <Solana />,
  didKey: <DidKey />,
  noDid: <NoEth />,
};

export type DidFieldProps = {
  did: string;
  isValid?: boolean;
  textColor?: Color;
  copyLabel?: string;
  copiedLabel?: string;
  copiable?: boolean;
  customStyle?: string;
};
const DidField: React.FC<DidFieldProps> = ({
  did,
  isValid = true,
  textColor = { light: 'secondaryLight', dark: 'secondaryDark' },
  copiable = true,
  copyLabel,
  copiedLabel,
  customStyle = '',
}) => {
  const networkType = getDidNetworkType(did);
  const truncatedDid = truncateDid(did, networkType);

  const didDisplayBlock = (
    <Stack direction="row" spacing="gap-x-1.5" align="center" customStyle={customStyle}>
      {networkType && <Icon icon={isValid ? didNetworkIconMapping[networkType] : <NoEth />} />}
      <Text variant="footnotes1" color={textColor}>
        {truncatedDid}
      </Text>
    </Stack>
  );

  return copiable ? (
    <CopyToClipboard value={did} copyText={copyLabel} copiedText={copiedLabel}>
      {didDisplayBlock}
    </CopyToClipboard>
  ) : (
    didDisplayBlock
  );
};

export default DidField;
