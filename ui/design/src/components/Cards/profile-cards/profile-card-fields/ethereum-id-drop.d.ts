interface IProfileEditMenuProps {
  target: {};
  onClose: () => void;
  ensName?: string;
  ethAddress: string;
  ethereumAddressLabel?: string;
  ethereumNameLabel?: string;
  copyLabel?: string;
  showQRCodeLabel?: string;
}
declare const EthereumIdDrop: (props: IProfileEditMenuProps) => JSX.Element;
export default EthereumIdDrop;
