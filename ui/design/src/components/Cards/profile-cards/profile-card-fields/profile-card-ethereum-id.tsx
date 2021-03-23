import { Box, Text } from 'grommet';
import * as React from 'react';
import { IProfileData } from '../profile-widget-card';
import { Icon } from '../../../Icon';
import { isMobile } from 'react-device-detect';
import Tooltip from '../../../Tooltip/tooltip';
import { truncateMiddle } from '../../../../utils/string-utils';

export interface IProfileCardEthereumIdProps {
  ethereumAddressLabel?: string;
  ethereumNameLabel?: string;
  copyLabel?: string;
  copiedLabel?: string;
  showQRCodeLabel?: string;
  profileData: IProfileData;
}

const ProfileCardEthereumId: React.FC<IProfileCardEthereumIdProps> = props => {
  const { ethereumAddressLabel, ethereumNameLabel, copyLabel, copiedLabel, profileData } = props;
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
    navigator.clipboard.writeText(profileData.ensName ?? profileData.ethAddress);
    setIsCopied(true);
  };

  return (
    <>
      <Box direction="column" pad={{ vertical: 'xsmall', horizontal: 'medium' }} gap="xxsmall">
        <Text size="large" weight="bold" color="primaryText" style={{ lineHeight: 1.7 }}>
          {profileData.ensName ? ethereumNameLabel : ethereumAddressLabel}
        </Text>
        <Box direction="row" gap="xsmall" align="center">
          <Text color="primaryText" size={'medium'} truncate={true} style={{ lineHeight: 1.7 }}>
            {profileData.ensName
              ? profileData.ensName
              : isMobile
              ? truncateMiddle(profileData.ethAddress)
              : profileData.ethAddress}
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
  ethereumNameLabel: 'Ethereum name',
  ethereumAddressLabel: 'Ethereum address',
  copyLabel: 'Copy to clipboard',
  showQRCodeLabel: 'Show QR code',
  copiedLabel: 'Copied',
};

export default ProfileCardEthereumId;
