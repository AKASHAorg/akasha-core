import { Box, Drop, Text } from 'grommet';
import React from 'react';
import { TextIcon } from '../../TextIcon';
import QRCode from 'qrcode.react';

interface IProfileEditMenuProps {
  target: {};
  onClose: () => void;
  ensName?: string;
  ethAddress: string;
  // labels
  ethereumAddressLabel?: string;
  ethereumNameLabel?: string;
  copyLabel?: string;
  showQRCodeLabel?: string;
}

const EthereumIdDrop = (props: IProfileEditMenuProps) => {
  const {
    onClose,
    target,
    ethAddress,
    ensName,
    ethereumAddressLabel,
    ethereumNameLabel,
    showQRCodeLabel,
    copyLabel,
  } = props;

  const [QRCodeValue, setQRCodeValue] = React.useState<string | null>(null);

  const handleCopy = (data: string) => {
    navigator.clipboard.writeText(data);
    handleClose();
  };

  const handleClose = () => {
    onClose();
    setQRCodeValue(null);
  };

  const handleShowQR = (value: string) => {
    setQRCodeValue(value);
  };

  const renderText = () => (
    <>
      {ensName && (
        <Box gap="xsmall" pad={{ bottom: 'small' }}>
          <Text size="small" color="secondaryText">
            {ethereumNameLabel}
          </Text>
          <TextIcon
            iconType="copy"
            fontSize="small"
            label={copyLabel}
            onClick={() => handleCopy(ensName)}
            clickable={true}
          />
          <TextIcon
            iconType="copy"
            fontSize="small"
            label={showQRCodeLabel}
            onClick={() => handleShowQR(ensName)}
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
          onClick={() => handleCopy(ethAddress)}
          clickable={true}
        />
        <TextIcon
          iconType="copy"
          fontSize="small"
          label={showQRCodeLabel}
          onClick={() => handleShowQR(ethAddress)}
          clickable={true}
        />
      </Box>
    </>
  );
  return (
    <Drop
      overflow="hidden"
      target={target}
      align={{ top: 'bottom', right: 'right' }}
      onClickOutside={handleClose}
      onEsc={handleClose}
    >
      <Box
        round="xxsmall"
        pad="small"
        border={{ size: 'xsmall', color: 'border', side: 'all', style: 'solid' }}
      >
        {QRCodeValue && <QRCode value={QRCodeValue} />}
        {!QRCodeValue && renderText()}
      </Box>
    </Drop>
  );
};

export default EthereumIdDrop;
