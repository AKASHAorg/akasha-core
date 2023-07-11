import React from 'react';
import { iconForDid, truncateDid } from '../../utils/did-utils';
import Stack from '../Stack';
import Icon from '../Icon';
import Text from '../Text';
import { Color } from '../types/common.types';

type DidFieldProps = {
  did: string;
  textColor?: Color;
};
const DidField: React.FC<DidFieldProps> = ({
  did,
  textColor = { light: 'secondaryLight', dark: 'secondaryDark' },
}) => {
  const icon = iconForDid(did);
  const truncatedDid = truncateDid(did, icon);

  return (
    <Stack spacing="gap-x-1.5" align="center">
      <Icon type={icon} />
      <Text variant="footnotes1" color={textColor}>
        {truncatedDid}
      </Text>
    </Stack>
  );
};

export default DidField;
