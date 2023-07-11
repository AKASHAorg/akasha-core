import { inject, injectable } from 'inversify';
import { ethers } from 'ethers';
import {
  EthProviders,
  EthProvidersSchema,
  INJECTED_PROVIDERS,
  PROVIDER_ERROR_CODES,
  TYPES,
  WEB3_EVENTS,
} from '@akashaorg/typings/sdk';
import detectEthereumProvider from '@metamask/detect-provider';
import { EthereumProvider } from '@walletconnect/ethereum-provider';
import Logging from '../logging';
import EventBus from './event-bus';
import { throwError } from 'rxjs';
import pino from 'pino';
import { createFormattedValue } from '../helpers/observable';
import { validate } from './validator';
import { z } from 'zod';
import { IEthereumProvider } from '@walletconnect/ethereum-provider/dist/types/EthereumProvider';

@injectable()
class Web3Connector {
  #logFactory: Logging;
  #log: pino.Logger;
  #web3Instance: ethers.providers.BaseProvider | ethers.providers.Web3Provider | null;
  #globalChannel: EventBus;
  #wallet: ethers.Wallet | null;
  #walletConnect: IEthereumProvider | null;
  #currentProviderId: EthProviders | null;
  readonly network = 'goerli';
  #networkId = '0x5';
  // mapping for network name and ids
  readonly networkId = Object.freeze({
    mainnet: 1,
    ropsten: 3,
    rinkeby: 4,
    goerli: 5,
    kovan: 42,
    sepolia: 11155111,
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
    this.#web3Instance = null;
    this.#wallet = null;
    this.#walletConnect = null;
    this.#currentProviderId = null;
  }

  /**
   *
   * @param provider - Number representing the provider option
   */
  @validate(EthProvidersSchema)
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
      return this.#web3Instance.send('wallet_requestPermissions', [{ eth_accounts: {} }]);
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
    } else {
      this.#web3Instance = new ethers.providers.InfuraProvider(
        {
          name: this.network,
          chainId: this.networkId[this.network],
        },
        process.env.INFURA_ID,
      );
      return this.#web3Instance;
    }
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
    if (this.#walletConnect instanceof EthereumProvider) {
      await this.#walletConnect.disconnect();
    }
  }

  /**
   * Enforce personal_sign method for message signature
   * @param message - Human readable string to sign
   */
  @validate(z.string().min(3))
  signMessage(message: string) {
    return this.getSigner()?.signMessage(message);
  }

  getSigner() {
    if (this.#wallet instanceof ethers.Wallet) {
      return this.#wallet;
    }
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      return this.#web3Instance.getSigner();
    }
    this.#log.warn('Must provider a signer!');
    return;
  }

  getRequiredNetwork() {
    if (!this.network) {
      throw new Error('The required ethereum network was not set!');
    }
    return createFormattedValue({ name: this.network, chainId: this.networkId[this.network] });
  }

  async switchToRequiredNetwork() {
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      const result = await this.#web3Instance.send('wallet_switchEthereumChain', [
        { chainId: this.#networkId },
      ]);
      return createFormattedValue(result);
    }
    const err: Error & {
      code?: number;
    } = new Error(`Method wallet_switchEthereumChain not supported on the current provider`);
    err.code = PROVIDER_ERROR_CODES.WrongNetwork;
    throw err;
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

  getCurrentEthAddress() {
    return this.#_getCurrentAddress();
  }

  checkCurrentNetwork() {
    return this.#_checkCurrentNetwork();
  }

  async detectInjectedProvider() {
    return createFormattedValue(await this.#_detectInjectedProvider());
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
  async #_checkCurrentNetwork() {
    if (!this.#web3Instance) {
      throw new Error('Must connect first to a provider!');
    }
    const network = await this.#web3Instance.detectNetwork();
    if (network?.chainId !== this.networkId[this.network]) {
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
    let ethProvider: ethers.providers.ExternalProvider | undefined;
    const network = {
      name: this.network,
      chainId: this.networkId[this.network],
    };
    if (provider === EthProviders.FallbackProvider || provider === EthProviders.None) {
      return new ethers.providers.InfuraProvider(network, process.env.INFURA_ID);
    }

    if (provider === EthProviders.Web3Injected) {
      ethProvider = await this.#_getInjectedProvider();
    }

    if (provider === EthProviders.WalletConnect) {
      this.#walletConnect = await this.#_getWalletConnectProvider();
      ethProvider = this.#walletConnect;
    }
    if (!ethProvider) {
      throw new Error('No Web3 Provider found');
    }
    const web3Provider = new ethers.providers.Web3Provider(ethProvider, network);
    this.#_registerProviderChangeEvents(web3Provider);
    return web3Provider;
  }

  /**
   * Handler for web3 provider from metamask extension
   * and dApp browsers(ex: metamask mobile dApp browser)
   */
  async #_getInjectedProvider() {
    const provider:
      | (ethers.providers.ExternalProvider & {
          on?: (event: string, listener: (...args: unknown[]) => void) => void;
        })
      | null = await detectEthereumProvider();

    if (!provider) {
      throw new Error('No Web3 Provider found');
    }
    if (!provider.request) {
      throw new Error('Provider does not support request method');
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
    if (!provider) {
      throw new Error('Provider not specified');
    }
    if (!provider.on) {
      throw new Error('Provider does not support on method');
    }
    provider.on('accountsChanged', ethAddress => {
      this.#log.warn(`ethereum address changed ${ethAddress}`);
      this.#globalChannel.next({
        data: {
          ethAddress,
        },
        event: WEB3_EVENTS.ACCOUNT_CHANGED,
      });
    });
    provider.on('chainChanged', chainId => {
      this.#log.warn(`ethereum chain ID changed ${chainId}`);
      this.#globalChannel.next({
        data: {
          chainId,
        },
        event: WEB3_EVENTS.CHAIN_CHANGED,
      });
    });
  }

  /**
   * Enables qr code scan to connect from a mobile wallet
   */
  async #_getWalletConnectProvider() {
    const provider = await EthereumProvider.init({
      projectId: process.env.WALLETCONNECT_PROJECT_ID as string,
      chains: [this.networkId[this.network]],
      showQrModal: true,
      events: ['chainChanged', 'accountsChanged', 'connect', 'disconnect'],
      qrModalOptions: {
        themeVariables: {
          '--wcm-font-family': 'Inter, Content-font, Roboto, sans-serif',
          '--wcm-background-color': '#7222d2 ',
          '--wcm-accent-color': '#4e71ff',
        },
        privacyPolicyUrl: 'https://akasha.org/privacy-policy/', //example
        termsOfServiceUrl: 'https://akasha.org/legal/',
      },
    });

    // must wait for the approval
    await provider.enable();
    return provider;
  }
}

export default Web3Connector;
