import { inject, injectable } from 'inversify';
import { ethers } from 'ethers';
import { EthProviders, IWeb3Connector } from '@akashaproject/sdk-typings/lib/interfaces';
import detectEthereumProvider from '@metamask/detect-provider';
import WalletConnectProvider from '@walletconnect/web3-provider';
import { TYPES } from '@akashaproject/sdk-typings';
import Logging from '../logging';
import { ILogger } from '@akashaproject/sdk-typings/lib/interfaces/log';
import OpenLogin from '@toruslabs/openlogin';
import { createObservableStream, createObservableValue } from '../helpers/observable';
import EventBus from './event-bus';
import { AUTH_EVENTS, WEB3_EVENTS } from '@akashaproject/sdk-typings/lib/interfaces/events';
import {
  INJECTED_PROVIDERS,
  PROVIDER_ERROR_CODES,
} from '@akashaproject/sdk-typings/lib/interfaces/common';
import { throwError } from 'rxjs';

@injectable()
export default class Web3Connector
  implements IWeb3Connector<ethers.providers.BaseProvider | ethers.providers.Web3Provider>
{
  #logFactory: Logging;
  #log: ILogger;
  #web3Instance: ethers.providers.BaseProvider | ethers.providers.Web3Provider;
  #globalChannel: EventBus;
  #wallet: ethers.Wallet;
  #openLogin: OpenLogin;
  #walletConnect: WalletConnectProvider;
  #currentProviderId: EthProviders;
  // only rinkeby network is supported atm
  readonly network = 'rinkeby';
  #networkId = '0x4';
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
  constructor(
    @inject(TYPES.Log) logFactory: Logging,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this.#logFactory = logFactory;
    this.#log = this.#logFactory.create('Web3Connector');
    this.#globalChannel = globalChannel;
  }

  /**
   *
   * @param provider - Number representing the provider option
   */
  async connect(provider: EthProviders = EthProviders.None): Promise<boolean> {
    this.#log.info(`connecting to provider ${provider}`);
    if (this.#web3Instance && this.#currentProviderId && this.#currentProviderId === provider) {
      this.#log.info(`provider ${provider} already connected`);
      return true;
    }
    this.#web3Instance = await this.#_getProvider(provider);
    this.#currentProviderId = provider;
    this.#globalChannel.next({
      data: { provider },
      event: WEB3_EVENTS.CONNECTED,
    });
    this.#log.info(`connected to provider ${provider}`);
    return true;
  }

  requestWalletPermissions() {
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      return createObservableStream(
        this.#web3Instance.send('wallet_requestPermissions', [{ eth_accounts: {} }]),
      );
    }
    return throwError(() => {
      return new Error(`Method wallet_requestPermissions not supported on the current provider`);
    });
  }
  /**
   * Get access to the web3 provider instance
   */
  get provider() {
    if (this.#web3Instance) {
      return this.#web3Instance;
    }
    throw new Error('Must connect first to a provider!');
  }

  /**
   * Remove the web3 connection
   */
  async disconnect(): Promise<void> {
    this.#web3Instance = null;
    this.#currentProviderId = null;
    this.#globalChannel.next({
      data: undefined,
      event: WEB3_EVENTS.DISCONNECTED,
    });
    if (this.#openLogin instanceof OpenLogin) {
      await this.#openLogin.logout();
    }
    if (this.#walletConnect instanceof WalletConnectProvider) {
      await this.#walletConnect.disconnect();
    }
  }

  /**
   * Enforce personal_sign method for message signature
   * @param message - Human readable string to sign
   */
  async signMessage(message: string) {
    return this.getSigner().signMessage(message);
  }

  getSigner() {
    if (this.#wallet instanceof ethers.Wallet) {
      return this.#wallet;
    }
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      return this.#web3Instance.getSigner();
    }
    throw new Error('Must provider a signer!');
  }

  /**
   * @returns the current eth address that is connected to the provider
   */
  getCurrentAddress() {
    return createObservableStream(this.#_getCurrentAddress());
  }

  getRequiredNetworkName() {
    if (!this.network) {
      throw new Error('The required ethereum network was not set!');
    }
    return createObservableValue(this.network);
  }

  switchToRequiredNetwork() {
    if (this.#web3Instance instanceof ethers.providers.Web3Provider)
      return createObservableStream(
        this.#web3Instance.send('wallet_switchEthereumChain', [{ chainId: this.#networkId }]),
      );

    return throwError(() => {
      return new Error(`Method wallet_switchEthereumChain not supported on the current provider`);
    });
  }

  async #_getCurrentAddress() {
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      const signer = await this.#web3Instance.getSigner();
      return signer.getAddress();
    }
    if (this.#wallet instanceof ethers.Wallet) {
      return this.#wallet.getAddress();
    }
    return null;
  }

  checkCurrentNetwork() {
    return createObservableStream(this.#_checkCurrentNetwork());
  }
  detectInjectedProvider() {
    return createObservableStream(this.#_detectInjectedProvider());
  }

  async #_detectInjectedProvider() {
    const ethProvider = await detectEthereumProvider();
    if (!ethProvider) {
      return INJECTED_PROVIDERS.NOT_DETECTED;
    }
    const injectedProviders = [
      { flag: 'isSafe', name: INJECTED_PROVIDERS.SAFE },
      { flag: 'isNiftyWallet', name: INJECTED_PROVIDERS.NIFTY },
      { flag: 'isDapper', name: INJECTED_PROVIDERS.DAPPER },
      { flag: 'isOpera', name: INJECTED_PROVIDERS.OPERA },
      { flag: 'isTrust', name: INJECTED_PROVIDERS.TRUST },
      { flag: 'isToshi', name: INJECTED_PROVIDERS.COINBASE },
      { flag: 'isCipher', name: INJECTED_PROVIDERS.CIPHER },
      { flag: 'isImToken', name: INJECTED_PROVIDERS.IM_TOKEN },
      { flag: 'isStatus', name: INJECTED_PROVIDERS.STATUS },
      { flag: 'isMetaMask', name: INJECTED_PROVIDERS.METAMASK },
    ];
    let detectedProvider = INJECTED_PROVIDERS.FALLBACK;
    for (const injectedProvider of injectedProviders) {
      if (ethProvider.hasOwnProperty(injectedProvider.flag) && ethProvider[injectedProvider.flag]) {
        detectedProvider = injectedProvider.name;
        break;
      }
    }
    return detectedProvider;
  }
  /**
   * Ensures that the web3 provider is connected to the specified network
   */
  async #_checkCurrentNetwork(): Promise<void> {
    const network = await this.#web3Instance.detectNetwork();
    if (network?.name !== this.network) {
      const error: Error & { code?: number } = new Error(
        `Please change the ethereum network to ${this.network}!`,
      );
      error.code = PROVIDER_ERROR_CODES.WrongNetwork;
      throw error;
    }
    this.#log.info(`currently on network: ${network.name}`);
  }

  /**
   *
   * @param provider - Number representing the provider option
   */
  async #_getProvider(provider: EthProviders) {
    let ethProvider;

    if (provider === EthProviders.FallbackProvider || provider === EthProviders.None) {
      return ethers.getDefaultProvider(this.network, { infura: process.env.INFURA_ID });
    }

    if (provider === EthProviders.Torus) {
      const openLogin = await this.#_getTorusProvider();
      const provider = ethers.getDefaultProvider(this.network, { infura: process.env.INFURA_ID });
      this.#wallet = new ethers.Wallet(openLogin.privKey, provider);
      return provider;
    }

    if (provider === EthProviders.Web3Injected) {
      ethProvider = await this.#_getInjectedProvider();
    }

    if (provider === EthProviders.WalletConnect) {
      this.#walletConnect = await this.#_getWalletConnectProvider();
      ethProvider = this.#walletConnect;
    }
    const web3Provider = new ethers.providers.Web3Provider(ethProvider, this.network);
    this.#_registerProviderChangeEvents(web3Provider);
    return web3Provider;
  }

  /**
   * Handler for web3 provider from metamask extension
   * and dApp browsers(ex: metamask mobile dApp browser)
   */
  async #_getInjectedProvider() {
    const provider: ethers.providers.ExternalProvider & {
      on?: (event: string, listener: (...args: unknown[]) => void) => void;
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
    // this registers listeners on window.ethereum
    this.#_registerProviderChangeEvents(provider);
    return provider;
  }

  #_registerProviderChangeEvents(provider: {
    on?: (event: string, listener: (...args: unknown[]) => void) => void;
  }) {
    provider.on('accountsChanged', () => {
      this.#log.warn('ethereum address changed');
      this.#globalChannel.next({
        data: {},
        event: WEB3_EVENTS.ACCOUNT_CHANGED,
      });
    });
    provider.on('chainChanged', () => {
      this.#log.warn('ethereum chain ID changed');
      this.#globalChannel.next({
        data: {},
        event: WEB3_EVENTS.CHAIN_CHANGED,
      });
    });
  }
  /**
   * Connects to Torus and retrieves private key
   * @returns OpenLogin instance
   */
  async #_getTorusProvider() {
    this.#openLogin = new OpenLogin({
      clientId: process.env.TORUS_PROJECT,
      network: 'testnet',
      uxMode: 'popup',
    });
    await this.#openLogin.init();
    if (!this.#openLogin.privKey) {
      await this.#openLogin.login();
    }
    return this.#openLogin;
  }

  /**
   * Enables qr code scan to connect from a mobile wallet
   */
  async #_getWalletConnectProvider() {
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
