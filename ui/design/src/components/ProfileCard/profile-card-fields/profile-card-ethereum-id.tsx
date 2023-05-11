import { Box, Text } from 'grommet';
import * as React from 'react';
import Icon from '../../Icon';
import { isMobile } from 'react-device-detect';
import Tooltip from '../../Tooltip';
import { truncateMiddle } from '../../../utils/string-utils';
import { Profile } from '@akashaorg/typings/sdk/graphql-types-new';

export type IProfileCardEthereumIdProps = {
  profileDidLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  showQRCodeLabel?: string;
  profileData: Profile;
};

const ProfileCardEthereumId: React.FC<IProfileCardEthereumIdProps> = props => {
  const { profileDidLabel, copyLabel, copiedLabel, profileData } = props;
  const [isCopied, setIsCopied] = React.useState(false);
  const popoverRef: React.Ref<any> = React.useRef(null);

  React.useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }
  }, [isCopied]);

  const handleCopy = () => {
    navigator.clipboard.writeText(profileData.did.id);
    setIsCopied(true);
  };

  return (
    <>
      <Box direction="column" pad={{ vertical: 'xsmall', horizontal: 'medium' }} gap="xxsmall">
        <Box direction="row" gap="xsmall" align="center">
          <Text color="primaryText" size={'medium'} truncate={true} style={{ lineHeight: 1.7 }}>
            {isMobile ? truncateMiddle(profileData.did.id) : profileData.did.id}
          </Text>
          <Tooltip
            dropProps={{ align: isMobile ? { right: 'left' } : { left: 'right' } }}
            message={isCopied ? (copiedLabel as string) : (copyLabel as string)}
            icon={isCopied ? 'check' : undefined}
            plain={true}
            caretPosition={isMobile ? 'right' : 'left'}
          >
            <Icon type="copy" clickable={true} onClick={handleCopy} ref={popoverRef} />
          </Tooltip>
        </Box>
      </Box>
    </>
  );
};

ProfileCardEthereumId.defaultProps = {
  profileDidLabel: 'Profile DID',
  copyLabel: 'Copy to clipboard',
  showQRCodeLabel: 'Show QR code',
  copiedLabel: 'Copied',
};

export default ProfileCardEthereumId;
