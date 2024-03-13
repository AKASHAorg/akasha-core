import { injectable } from 'inversify';

export const SDKConfigOptions = [
  'ceramic_api_endpoint',
  'graphql_uri',
  'indexing_did',
  'w3_storage_delegate_base_url',
  'ipfs_path_gateway',
  'ipfs_origin_gateway',
  'ipfs_fallback_gateway',
  'wallet_connect_project_id',
  'log_level',
] as const;

@injectable()
class AWF_Config {
  readonly #_config: { [k in (typeof SDKConfigOptions)[number]]: string };

  constructor() {
    this.#_config = {
      ceramic_api_endpoint: process.env.CERAMIC_API_ENDPOINT as string,
      graphql_uri: process.env.GRAPHQL_URI as string,
      indexing_did: process.env.INDEXING_DID as string,
      w3_storage_delegate_base_url: process.env.W3_STORAGE_DELEGATE_BASE_URL as string,
      wallet_connect_project_id: process.env.WALLETCONNECT_PROJECT_ID as string,
      log_level: process.env.LOG_LEVEL || 'warn',
      ipfs_path_gateway: 'https://cloudflare-ipfs.com/ipfs/',
      ipfs_origin_gateway: 'ipfs.w3s.link',
      ipfs_fallback_gateway: 'ipfs.cf-ipfs.com',
    };
  }

  /**
   * Set a config value.
   * @param key - Config key
   * @param value - New config value
   *
   * @example
   *
   * ```
   * const config = new Config();
   * config.setOption('log_level', 'debug');
   * ```
   */
  setOption(key: (typeof SDKConfigOptions)[number], value: string) {
    this.#_config[key] = value.trim();
  }

  /**
   * Get a config value.
   * @param key - Config key
   * @returns Config value
   *
   * @example
   *
   * ```
   * const config = new Config();
   * const ceramicEndpoint = config.get('ceramic_api_endpoint');
   * ```
   */
  getOption(key: (typeof SDKConfigOptions)[number]) {
    const value = this.#_config[key];
    if (typeof value === 'undefined') {
      return '';
    }
    return this.#_config[key];
  }
}

export default AWF_Config;
