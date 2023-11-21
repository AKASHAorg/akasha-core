import { inject, injectable } from 'inversify';
import { ethers } from 'ethers';
import {
  EthProviders,
  EthProvidersSchema,
  PROVIDER_ERROR_CODES,
  TYPES,
  WEB3_EVENTS,
} from '@akashaorg/typings/lib/sdk';
import Logging from '../logging';
import EventBus from './event-bus';
import pino from 'pino';
import { createFormattedValue } from '../helpers/observable';
import { validate } from './validator';
import { z } from 'zod';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5';
import type { Web3Modal } from '@web3modal/ethers5/dist/types/src/client';

@injectable()
class Web3Connector {
  #logFactory: Logging;
  #log: pino.Logger;
  #web3Instance: ethers.providers.Web3Provider | undefined | null;
  #globalChannel: EventBus;
  #wallet: ethers.Wallet | null;
  #w3modal: Web3Modal;
  #currentProviderType: string | undefined | null;
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
  constructor (
    @inject(TYPES.Log) logFactory: Logging,
    @inject(TYPES.EventBus) globalChannel: EventBus,
  ) {
    this.#logFactory = logFactory;
    this.#log = this.#logFactory.create('Web3Connector');
    this.#globalChannel = globalChannel;
    this.#web3Instance = null;
    this.#wallet = null;
    const projectId = process.env.WALLETCONNECT_PROJECT_ID as string;
    if (!projectId) {
      throw new Error('WALLETCONNECT_PROJECT_ID is not set');
    }

    const chains = [
      {
        chainId: this.networkId.goerli,
        name: 'Ethereum',
        currency: 'ETH',
        explorerUrl: 'https://goerli.etherscan.io/',
        rpcUrl: 'https://ethereum.akasha.world/v1/goerli',
      },
    ];

    const ethersConfig = defaultConfig({
      metadata: {
        name: 'AKASHA World',
        description: 'AKASHA Web3Modal',
        url: 'https://akasha.world',
        icons: ['https://avatars.githubusercontent.com/u/9638191'],
      },
      defaultChainId: this.networkId.goerli,
      rpcUrl: 'https://ethereum.akasha.world/v1/goerli',
    });

    this.#w3modal = createWeb3Modal({
      ethersConfig,
      projectId,
      chains,
      themeMode: 'light',
      themeVariables: {
        '--w3m-font-family': 'Inter, Content-font, Roboto, sans-serif',
        '--w3m-color-mix': '#7222d2',
        '--w3m-accent': '#4e71ff',
      },
      privacyPolicyUrl: 'https://akasha.org/privacy-policy/',
      termsConditionsUrl: 'https://akasha.org/legal/',
    });
    this.#_registerWalletChangeEvents();
  }


  @validate(EthProvidersSchema)
  async connect (): Promise<void> {
    if (!this.#w3modal.getIsConnected()) {
      await this.#w3modal.open({ view: 'Connect' });
    }
  }

  #_registerWalletChangeEvents () {
    this.#w3modal.subscribeProvider(event => {
      if (event.isConnected) {
        this.#web3Instance = this.#w3modal.getWalletProvider();
        this.#currentProviderType = this.#w3modal?.getWalletProviderType();
        this.#globalChannel.next({
          data: { providerType: this.#currentProviderType },
          event: WEB3_EVENTS.CONNECTED,
        });
        if (this.#web3Instance) {
          this.#_registerProviderChangeEvents(this.#web3Instance);
        }
      } else {
        if (this.#web3Instance) {
          this.#web3Instance.removeAllListeners(['accountsChanged', 'chainChanged']);
        }
      }
    });
  }

  get state () {
    return {
      providerType: this.#currentProviderType,
      connected: this.#w3modal.getIsConnected(),
      address: this.#w3modal.getAddress(),
      chainId: this.#w3modal.getChainId(),
    };
  }

  /**
   * Get access to the web3 provider instance
   */
  get provider () {
    if (this.#web3Instance) {
      return this.#web3Instance;
    }
  }

  /**
   * Remove the web3 connection
   */
  async disconnect (): Promise<void> {
    this.#web3Instance = null;
    this.#currentProviderType = null;
    await this.#w3modal?.disconnect();
    this.#globalChannel.next({
      data: undefined,
      event: WEB3_EVENTS.DISCONNECTED,
    });
  }

  /**
   * Enforce personal_sign method for message signature
   * @param message - Human readable string to sign
   */
  @validate(z.string().min(3))
  signMessage (message: string) {
    return this.getSigner()?.signMessage(message);
  }

  getSigner () {
    if (this.#wallet instanceof ethers.Wallet) {
      return this.#wallet;
    }
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      return this.#web3Instance.getSigner();
    }
    this.#log.warn('Must provider a signer!');
    return;
  }

  getRequiredNetwork () {
    if (!this.network) {
      throw new Error('The required ethereum network was not set!');
    }
    return createFormattedValue({ name: this.network, chainId: this.networkId[this.network] });
  }

  async switchToRequiredNetwork () {
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

  async #_getCurrentAddress () {
    if (this.#web3Instance instanceof ethers.providers.Web3Provider) {
      const signer = this.#web3Instance.getSigner();
      return signer.getAddress();
    }
    if (this.#wallet instanceof ethers.Wallet) {
      return this.#wallet.getAddress();
    }
    return null;
  }

  getCurrentEthAddress () {
    return this.#_getCurrentAddress();
  }

  checkCurrentNetwork () {
    return this.#_checkCurrentNetwork();
  }

  /**
   * Ensures that the web3 provider is connected to the specified network
   */
  async #_checkCurrentNetwork () {
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

  #_registerProviderChangeEvents (provider: {
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
}

export default Web3Connector;
