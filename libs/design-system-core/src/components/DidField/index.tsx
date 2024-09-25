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
  did: <DidKey />,
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

/**
 * A DidField component provides a stylish way to display a DID address. It will include a
 * corresponding network icon, truncate the address if it's too long, and provide a CopyToClipboard
 * functionality that can also be disabled depending on the use case.
 * @param did - a DID address
 * @param isValid - boolean (optional) whether it is a valid DID
 * @param textColor - (optional) customize the text color
 * @param copyLabel - (optional) specify the label on hover before copying to clipbaord
 * @param copiedLabel - (optional) specify the label on hover after copying to clipbaord
 * @param copiable - boolean (optional) whether CopyToClipboard should be enabled
 * @param customStyle - (optional) customize the style
 * ```tsx
 *  <DidField did='0x003410490050000320006570034567114572000' />
 * ```
 **/
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
    <CopyToClipboard stringToBeCopied={did} copyText={copyLabel} copiedText={copiedLabel}>
      {didDisplayBlock}
    </CopyToClipboard>
  ) : (
    didDisplayBlock
  );
};

export default DidField;
