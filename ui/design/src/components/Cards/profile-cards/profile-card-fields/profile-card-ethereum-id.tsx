import { Box, Text } from 'grommet';
import * as React from 'react';
import { IProfileData } from '../profile-widget-card';
import { Icon } from '../../../Icon';
import EthereumIdDrop from './ethereum-id-drop';

export interface IProfileCardEthereumIdProps {
  ethereumAddressLabel?: string;
  ethereumNameLabel?: string;
  copyLabel?: string;
  showQRCodeLabel?: string;
  profileData: IProfileData;
}

const ProfileCardEthereumId: React.FC<IProfileCardEthereumIdProps> = props => {
  const {
    ethereumAddressLabel,
    ethereumNameLabel,
    copyLabel,
    showQRCodeLabel,
    profileData,
  } = props;

  const [popoverOpen, setPopoverOpen] = React.useState(false);

  const popoverRef: React.Ref<any> = React.useRef(null);

  const togglePopover = () => {
    setPopoverOpen(!popoverOpen);
  };

  const closePopover = () => {
    setPopoverOpen(false);
  };

  return (
    <>
      <Box direction="column" pad="medium" gap="medium">
        <Text size="large" weight="bold" color="primaryText">
          {profileData.ensName ? ethereumNameLabel : ethereumAddressLabel}
        </Text>
        <Box direction="row" gap="xsmall" align="center">
          <Text color="primaryText">
            {profileData.ensName ? profileData.ensName : profileData.ethAddress}
          </Text>
          <Icon type="copy" clickable={true} onClick={togglePopover} ref={popoverRef} />
        </Box>
      </Box>
      {popoverOpen && popoverRef.current && (
        <EthereumIdDrop
          onClose={closePopover}
          target={popoverRef.current}
          copyLabel={copyLabel}
          showQRCodeLabel={showQRCodeLabel}
          ethAddress={profileData.ethAddress}
          ensName={profileData.userName}
          ethereumAddressLabel={ethereumAddressLabel}
          ethereumNameLabel={ethereumNameLabel}
        />
      )}
    </>
  );
};

ProfileCardEthereumId.defaultProps = {
  ethereumNameLabel: 'Ethereum Name',
  ethereumAddressLabel: 'Ethereum Address',
  copyLabel: 'Copy',
  showQRCodeLabel: 'Show QR code',
};

export default ProfileCardEthereumId;
