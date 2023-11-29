import React from 'react';

import Icon from '../Icon';
import Stack from '../Stack';
import Text from '../Text';

import CopyToClipboard from '../CopyToClipboard';
import { Eth, Solana, DidKey, NoEth } from '../Icon/akasha-icons';

import { Color } from '../types/common.types';
import { truncateDid } from '../../utils/did-utils';

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
  const ethIdentifier = 'eip155';
  const solanaIdentifier = 'solana';

  const iconForDid = (didKey: string): { type: string; icon: React.ReactElement } => {
    if (didKey) {
      if (didKey.includes(ethIdentifier)) {
        return { type: 'Eth', icon: <Eth /> };
      }
      // modify if we recognize more than 3 types of keys
      return didKey.includes(solanaIdentifier)
        ? { type: 'solana', icon: <Solana /> }
        : { type: 'didKey', icon: <DidKey /> };
    }
    return null;
  };

  const networkType = iconForDid(did);
  const truncatedDid = truncateDid(did, networkType.type);

  const didDisplayBlock = (
    <Stack direction="row" spacing="gap-x-1.5" align="center" customStyle={customStyle}>
      {networkType && <Icon icon={isValid ? networkType.icon : <NoEth />} />}
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
