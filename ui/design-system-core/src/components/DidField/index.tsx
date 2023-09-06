import React from 'react';

import Icon from '../Icon';
import Stack from '../Stack';
import Text from '../Text';

import CopyToClipboard from '../CopyToClipboard';

import { Color } from '../types/common.types';
import { iconForDid, truncateDid } from '../../utils/did-utils';

export type DidFieldProps = {
  did: string;
  isValid?: boolean;
  textColor?: Color;
  copyLabel?: string;
  copiedLabel?: string;
  copiable?: boolean;
};
const DidField: React.FC<DidFieldProps> = ({
  did,
  isValid = true,
  textColor = { light: 'secondaryLight', dark: 'secondaryDark' },
  copiable = true,
  copyLabel,
  copiedLabel,
}) => {
  const networkType = iconForDid(did);
  const truncatedDid = truncateDid(did, networkType);
  const didDisplayBlock = (
    <Stack direction="row" spacing="gap-x-1.5" align="center">
      {networkType && <Icon type={isValid ? networkType : 'noEth'} />}
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
