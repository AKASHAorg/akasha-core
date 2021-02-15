import detectEthereumProvider from '@metamask/detect-provider';

interface IWalletConnectConnectorOptions {
  infuraId: string;
  bridge?: string;
  qrcode?: boolean;
  network?: string;
}

export const ConnectToInjected = async () => {
  const provider: any = await detectEthereumProvider();
  if (!provider) {
    throw new Error('No Web3 Provider found');
  }
  provider.on('accountsChanged', _ => {
    // refresh on metamask logout or changed acc
    window.location.reload();
  });
  return provider;
};

function getChainId(network: string) {
  const infuraChainIds = {
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
  };
  const chainId = infuraChainIds[network];
  if (!chainId) {
    throw new Error(`Invalid or unknown chainId for network=${network}`);
  }
  return chainId;
}

export const ConnectToWalletConnect = (
  WalletConnectProvider: any,
  opts: IWalletConnectConnectorOptions,
) => {
  return new Promise(async (resolve, reject) => {
    const qrcode = true;
    let infuraId = '';
    let chainId = 1;

    if (opts) {
      infuraId = opts.infuraId || '';
      chainId = opts.network ? getChainId(opts.network) : 1;
    }

    const provider = new WalletConnectProvider({
      infuraId,
      chainId,
      qrcode,
    });

    await provider.enable();

    resolve(provider);
  });
};
