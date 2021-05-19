import { inject, injectable } from 'inversify';
import { ethers } from 'ethers';
import { EthProviders, IWeb3Connector } from '@akashaproject/sdk-typings/lib/interfaces';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { TYPES } from '@akashaproject/sdk-typings';
import { Logging } from '../logging';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';

@injectable()
export class Web3Connector
  implements IWeb3Connector<ethers.providers.BaseProvider | ethers.providers.Web3Provider> {
  @inject(TYPES.Log) _logFactory: Logging;
  _log: ILogger;
  _web3Instance: ethers.providers.BaseProvider | ethers.providers.Web3Provider;
  // only rinkeby network is supported atm
  readonly network = 'rinkeby';
  // mapping for network name and ids
  readonly networkId = Object.freeze({
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
  });

  /**
   *
   */
  constructor() {
    this._logFactory.create('Web3Connector').subscribe({
      next: l => (this._log = l.data),
    });
  }

  /**
   *
   * @param provider - Number representing the provider option
   */
  async connect(provider: EthProviders = EthProviders.None): Promise<void> {
    this._log.info(`connecting to provider ${provider}`);
    this._web3Instance = await this._getProvider(provider);
    this._log.info(`connected to provider ${provider}`);
  }

  /**
   * Get access to the web3 provider instance
   */
  get provider() {
    if (this._web3Instance) {
      return this._web3Instance;
    }
    throw new Error('Must connect first to a provider!');
  }

  /**
   * Remove the web3 connection
   */
  disconnect(): void {
    this._web3Instance = null;
  }

  /**
   * Enforce personal_sign method for message signature
   * @param message - Human readable string to sign
   */
  async signMessage(message: string) {
    const normalizedMessage = ethers.utils.toUtf8Bytes(message);
    if (this._web3Instance instanceof ethers.providers.Web3Provider) {
      const signer = await this._web3Instance.getSigner();
      const address = await signer.getAddress();
      return this._web3Instance.send('personal_sign', [
        ethers.utils.hexlify(normalizedMessage),
        address.toLowerCase(),
      ]);
    }
    throw new Error('Must provider a signer!');
  }

  /**
   * @returns the current eth address that is connected to the provider
   */
  async getCurrentAddress() {
    if (this._web3Instance instanceof ethers.providers.Web3Provider) {
      const signer = await this._web3Instance.getSigner();
      return signer.getAddress();
    }
    return null;
  }

  /**
   * Ensures that the web3 provider is connected to the specified network
   */
  async checkCurrentNetwork(): Promise<void> {
    const network = await this._web3Instance.detectNetwork();
    if (network?.name !== this.network) {
      throw new Error(`Please change the ethereum network to ${this.network}!`);
    }
    this._log.info(`currently on network: ${network.name}`);
  }

  /**
   *
   * @param provider - Number representing the provider option
   */
  async _getProvider(provider: EthProviders) {
    let ethProvider;
    if (provider === EthProviders.None) {
      return ethers.getDefaultProvider(this.network);
    }

    if (provider === EthProviders.FallbackProvider) {
      return ethers.getDefaultProvider(this.network, { infura: process.env.INFURA_ID });
    }

    if (provider === EthProviders.Web3Injected) {
      ethProvider = await this._getInjectedProvider();
    }

    if (provider === EthProviders.WalletConnect) {
      ethProvider = await this._getWalletConnectProvider();
    }
    return new ethers.providers.Web3Provider(ethProvider, this.network);
  }

  /**
   * Handler for web3 provider from metamask extension
   * and dApp browsers(ex: metamask mobile dApp browser)
   */
  async _getInjectedProvider() {
    const provider: ethers.providers.ExternalProvider & {
      on?: (event: string | symbol, listener: (...args: any[]) => void) => void;
    } = await detectEthereumProvider();
    if (!provider) {
      throw new Error('No Web3 Provider found');
    }
    const acc = await provider.request({
      method: 'eth_requestAccounts',
    });
    if (!acc?.length) {
      throw new Error('Must connect at least one address from the wallet.');
    }
    const refreshPage = () => {
      sessionStorage.clear();
      // refresh on metamask logout or changed acc
      window.location.reload();
    };
    provider.on('accountsChanged', refreshPage);
    provider.on('chainChanged', refreshPage);
    return provider;
  }

  /**
   * Enables qr code scan to connect from a mobile wallet
   */
  private async _getWalletConnectProvider() {
    const provider = new WalletConnectProvider({
      infuraId: process.env.INFURA_ID || '',
      chainId: this.networkId[this.network],
      qrcode: true,
    });
    // must wait for the approval
    await provider.enable();
    return provider;
  }
}
