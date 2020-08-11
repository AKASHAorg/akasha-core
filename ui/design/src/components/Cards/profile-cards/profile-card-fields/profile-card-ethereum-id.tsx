import { Box, Text, Drop } from 'grommet';
import * as React from 'react';
import { IProfileData } from '../profile-widget-card';
import { Icon } from '../../../Icon';
import { TextIcon } from '../../../TextIcon';

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

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data);
    closePopover();
  };

  const handleShowQR = () => {
    return;
  };

  const renderPopover = () => (
    <Drop
      overflow="hidden"
      target={popoverRef.current}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={closePopover}
      onEsc={closePopover}
    >
      <Box
        round="xxsmall"
        pad="small"
        gap="xsmall"
        border={{ size: 'xsmall', color: 'border', side: 'all', style: 'solid' }}
      >
        {profileData.ensName && (
          <Box gap="xsmall">
            <Text size="small" color="secondaryText">
              {ethereumNameLabel}
            </Text>
            <TextIcon
              iconType="copy"
              fontSize="small"
              label={copyLabel}
              onClick={() => handleCopy(profileData.ensName!)}
              clickable={true}
            />
            <TextIcon
              iconType="copy"
              fontSize="small"
              label={showQRCodeLabel}
              onClick={handleShowQR}
              clickable={true}
            />
          </Box>
        )}
        <Box gap="xsmall">
          <Text size="small" color="secondaryText">
            {ethereumAddressLabel}
          </Text>
          <TextIcon
            iconType="copy"
            fontSize="small"
            label={copyLabel}
            onClick={() => handleCopy(profileData.ethAddress)}
            clickable={true}
          />
          <TextIcon
            iconType="copy"
            fontSize="small"
            label={showQRCodeLabel}
            onClick={handleShowQR}
            clickable={true}
          />
        </Box>
      </Box>
    </Drop>
  );

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
      {popoverOpen && popoverRef.current && renderPopover()}
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
