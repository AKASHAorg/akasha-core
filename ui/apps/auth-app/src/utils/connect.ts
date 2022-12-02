import { ConnectWalletStatus } from '../components/connect';

const getDotColor = (status: ConnectWalletStatus) => {
  switch (status) {
    case ConnectWalletStatus.CONNECTING:
      return 'accent';
    case ConnectWalletStatus.CONNECTED:
      return 'green';
    case ConnectWalletStatus.ERROR:
      return 'errorText';
    default:
      return 'accent';
  }
};

const getStatusLabel = (status: ConnectWalletStatus, errorText?: string) => {
  switch (status) {
    case ConnectWalletStatus.CONNECTING:
      return 'Authorizing';
    case ConnectWalletStatus.CONNECTED:
      return 'Authorized';
    case ConnectWalletStatus.ERROR:
      return errorText;
    default:
      return 'Authorizing';
  }
};

export { getDotColor, getStatusLabel };
